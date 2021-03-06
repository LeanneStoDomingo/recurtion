const { Client } = require('@notionhq/client');
const { RRule } = require('rrule');
const { DateTime } = require("luxon");
const http = require('http');
const https = require('https');
require('dotenv').config();

// initializes a client
const notion = new Client({ auth: process.env.NOTION_TOKEN });

const CHECKBOX = process.env.CHECKBOX;
const DUE_DATE = process.env.DUE_DATE;
const RECUR_INTERVAL = process.env.RECUR_INTERVAL;
const INVALID = process.env.INVALID;

const getRecurringTasks = async () => {
    const res = await notion.search();
    const allTasks = res.results.filter(item => item.object === 'page');
    const recurringTasks = allTasks.filter(task => {

        // check if recur interval property exists
        let recurType = '';
        if (task.properties[RECUR_INTERVAL]) {
            recurType = task.properties[RECUR_INTERVAL].type;
        }

        // chooses the correct interval to use
        let recurring = false;
        if (recurType === 'select') {
            recurring = task.properties[RECUR_INTERVAL].select.name
        } else if (recurType === 'rich_text') {
            recurring = task.properties[RECUR_INTERVAL].rich_text.length
        }

        // the only tasks that should be modified have a 
        // recurring interval, is checked off, and has a date
        return recurring && task.properties[CHECKBOX].checkbox && task.properties[DUE_DATE];
    });

    return recurringTasks.map(task => {
        recurType = task.properties[RECUR_INTERVAL].type;

        let interval = '';
        if (recurType === 'select') {
            interval = task.properties[RECUR_INTERVAL].select.name
        } else if (recurType === 'rich_text') {
            interval = task.properties[RECUR_INTERVAL].rich_text[0].plain_text
        }

        return {
            id: task.id,
            date: task.properties[DUE_DATE].date.start,
            interval: interval,
            type: recurType,
            hasTime: task.properties[DUE_DATE].date.start.includes('T')
        }
    });
}

const findNextDueDate = ({ id, date, interval, type, hasTime }) => {
    try {
        options = RRule.parseText(interval);
    } catch (error) {
        updateInvalidInterval(id, interval, type);
        return null;
    }

    // js Date months are 0-11 instead of 1-12
    // if date includes time, then the time needs to be cut off of the day
    options.dtstart = new Date(date);

    const rule = new RRule(options);

    // finds a list of due dates that are on or before today 
    // and also includes the next due date as the last item
    let found = false;
    const dates = rule.all((date, i) => {
        if (!i) return true;    // always include the first 2 dates in the list
        const prev = !found;
        found = date > Date.now();
        return prev;
    });

    const dueDate = dates[dates.length - 1].toISOString();

    let dateTime = dueDate.slice(0, 10);;
    if (hasTime) {
        // converts from UTC to original timezone
        // timezone is taken from the last 6 characters of the date in ISO format
        dateTime = DateTime.fromISO(dueDate).setZone(`UTC${date.slice(-6)}`).toString();
    }

    return dateTime;
}

const updateInvalidInterval = async (id, interval, type) => {
    let payload = {}

    payload[CHECKBOX] = { checkbox: false }

    // checks if a warning has already been issued
    if (!interval.includes(INVALID)) {
        if (type === 'select') {
            payload[RECUR_INTERVAL] = { select: { name: INVALID } }
        } else if (type === 'rich_text') {
            payload[RECUR_INTERVAL] = {
                rich_text: [{
                    text: { content: `${INVALID}: ${interval}` },
                    plain_text: `${INVALID}: ${interval}`
                }]
            }
        }
    }

    await notion.pages.update({
        page_id: id,
        properties: payload
    });
}

const updateTask = async (id, date) => {
    let payload = {}

    payload[CHECKBOX] = { checkbox: false }
    payload[DUE_DATE] = { date: { start: date } }

    await notion.pages.update({
        page_id: id,
        properties: payload
    });
}


// Main function
setInterval(async () => {
    const tasks = await getRecurringTasks();
    tasks.forEach(task => {
        const date = findNextDueDate(task);
        if (date) updateTask(task.id, date);
    })
    console.log('Polling...')
}, 5000);   // check every 5 seconds


// web server
const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('ok');
});
server.listen(PORT);

setInterval(() => {
    https.get(process.env.ADDRESS);
    console.log('pinging server...');
}, 240000);      // ping every 4 minutes

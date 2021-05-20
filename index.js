const { Client } = require('@notionhq/client');
const { RRule } = require('rrule');
const { DateTime } = require("luxon");
require('dotenv').config();

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const getRecurringTasks = async () => {
    const res = await notion.search();
    const allTasks = res.results.filter(item => item.object === 'page');
    const recurringTasks = allTasks.filter(task => {
        return task.properties.Done.checkbox && task.properties['Recur Interval'].rich_text.length !== 0;
    });

    return recurringTasks.map(task => {
        return {
            id: task.id,
            date: task.properties['Due Date'].date.start,
            recurInterval: task.properties['Recur Interval'].rich_text[0].plain_text
        }
    });
}

const findNextDueDate = (id, date, interval) => {
    try {
        options = RRule.parseText(interval);
    } catch (error) {
        updateInvalidInterval(id, interval);
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

    const dueDate = dates[dates.length - 1];

    // converts from UTC to original timezone
    // timezone is taken from the last 6 characters of the date in ISO format
    const dateTime = DateTime.fromISO(dueDate.toISOString()).setZone(`UTC${date.slice(-6)}`);

    return dateTime.toString();
}

const updateInvalidInterval = async (id, interval) => {
    let payload = {
        Done: {
            checkbox: false
        }
    }

    // checks if a warning has already been issued
    if (!interval.includes('Invalid format')) {
        payload['Recur Interval'] = {
            rich_text: [
                {
                    text: {
                        content: `Invalid format: ${interval}`
                    },
                    plain_text: `Invalid format: ${interval}`
                }
            ]
        }
    }

    await notion.pages.update({
        page_id: id,
        properties: payload
    });
}

const updateTask = async (id, date) => {
    await notion.pages.update({
        page_id: id,
        properties: {
            Done: {
                checkbox: false
            },
            'Due Date': {
                date: {
                    start: date
                }
            }
        }
    });
}


// Main function
setInterval(async () => {
    const tasks = await getRecurringTasks();
    tasks.forEach(task => {
        const date = findNextDueDate(task.id, task.date, task.recurInterval);
        if (date) updateTask(task.id, date);
    })
    console.log('Polling...')
}, 1000);   // check every second
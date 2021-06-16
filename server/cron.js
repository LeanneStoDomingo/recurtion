const { Client } = require('@notionhq/client');
const { RRule } = require('rrule');
const { DateTime } = require("luxon");

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const { User, mongoose } = require('./schema');

const TYPES = {
    SELECT: 'select',
    RICHTEXT: 'rich_text'
}

const getDatabasesHelper = async (notion, intervalName, prevDbs, nextCursor) => {
    const res = await notion.search({
        start_cursor: nextCursor,
        filter: {
            property: 'object',
            value: 'database'
        }
    });

    const curDbs = await res.results.map(db => {
        const property = db.properties[intervalName];

        if (!property) return null

        return {
            id: db.id,
            intervalType: property.type
        }
    }).filter(db => db);

    const newDbs = [...prevDbs, ...curDbs];

    if (!res.has_more) return newDbs;

    return await getDatabasesHelper(notion, intervalName, newDbs, res.next_cursor);
}

const getDatabases = async (notion, intervalName) => {
    return await getDatabasesHelper(notion, intervalName, [], undefined)
}

const getTasksFromDbHelper = async (notion, db, checkboxName, dateName, intervalName, prevTasks, nextCursor) => {
    const res = await notion.databases.query({
        start_cursor: nextCursor,
        database_id: db.id,
        filter: {
            and: [
                {
                    property: checkboxName,
                    checkbox: { equals: true }
                },
                {
                    property: dateName,
                    date: { is_not_empty: true }
                },
                {
                    property: intervalName,
                    [db.intervalType]: { is_not_empty: true }
                }
            ]
        }
    });

    const curTasks = await res.results.map(task => {
        let interval = '';
        if (db.intervalType === TYPES.SELECT) {
            interval = task.properties[intervalName].select.name;
        } else if (db.intervalType === TYPES.RICHTEXT) {
            interval = task.properties[intervalName].rich_text[0].plain_text;
        } else {
            return null;
        }

        return {
            id: task.id,
            date: task.properties[dateName].date.start,
            interval,
            type: db.intervalType
        }
    }).filter(task => task);

    const newTasks = [...prevTasks, ...curTasks];

    if (!res.has_more) return newTasks;

    return await getTasksFromDbHelper(
        notion,
        db,
        checkboxName,
        dateName,
        intervalName,
        newTasks,
        res.next_cursor
    );
}

const getTasksFromDb = (notion, db, checkboxName, dateName, intervalName) => {
    return getTasksFromDbHelper(
        notion,
        db,
        checkboxName,
        dateName,
        intervalName,
        [],
        undefined
    );
}

const findNextDueDate = (notion, { id, date, interval, type }, checkboxName, intervalName, invalid) => {
    try {
        options = RRule.parseText(interval);
    } catch {
        updateInvalidInterval(notion, id, interval, type, checkboxName, intervalName, invalid);
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
    if (date.includes('T')) {
        // converts from UTC to original timezone
        // timezone is taken from the last 6 characters of the date in ISO format
        dateTime = DateTime.fromISO(dueDate).setZone(`UTC${date.slice(-6)}`).toString();
    }

    return dateTime;
}

const updateInvalidInterval = async (notion, id, interval, type, checkboxName, intervalName, invalid) => {
    let payload = { [checkboxName]: { checkbox: false } };

    // checks if a warning has already been issued
    if (!interval.includes(invalid)) {
        if (type === TYPES.SELECT) {
            payload[intervalName] = { select: { name: invalid } }
        } else if (type === TYPES.RICHTEXT) {
            payload[intervalName] = {
                rich_text: [{
                    text: { content: `${invalid}: ${interval}` },
                    plain_text: `${invalid}: ${interval}`
                }]
            }
        }
    }

    await notion.pages.update({
        page_id: id,
        properties: payload
    });
}

const updateTask = (notion, id, date, checkboxName, dateName) => {
    return notion.pages.update({
        page_id: id,
        properties: {
            [checkboxName]: { checkbox: false },
            [dateName]: { date: { start: date } }
        }
    });
}

const updateUser = async (user) => {
    if (!user.accessToken) return null;

    const notion = new Client({ auth: user.accessToken });

    const dbs = await getDatabases(notion, user.interval);

    const tasks = await Promise.all(dbs.map(db => getTasksFromDb(notion, db, user.checkbox, user.date, user.interval)));

    return tasks.flat().map(task => {
        const date = findNextDueDate(notion, task, user.checkbox, user.interval, user.invalid);
        if (!date) return null;
        return updateTask(notion, task.id, date, user.checkbox, user.date);
    }).filter(task => task);
}

// Main function
(async () => {
    const users = await User.find();
    await mongoose.disconnect();
    await Promise.all(users.map(user => updateUser(user)).filter(user => user).flat());
})();
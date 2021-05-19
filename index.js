const { Client } = require('@notionhq/client');
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


// Main function
(async () => {
    const tasks = await getRecurringTasks();
    console.log(tasks)
})()
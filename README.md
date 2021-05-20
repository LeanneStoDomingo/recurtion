# recurtion

A Notion integration that adds recurring tasks

## Setup Notion

## Setup Integration

- Option 1: Replit
- Option 2 (advanced): self-hosted/VPS

These steps were loosely based off of [An Idiot's Guide to hosting discord bots](https://anidiots.guide/hosting)

### Option 1: Replit

1. Create a **[replit](https://replit.com/)** account

2. Open the **[recurtion repl](https://replit.com/@LeanneStoDoming/recurtion)**

3. Fork the repl ![fork button](images/fork_repl.png)

4. Open the forked repl and go to the **Secrets** tab on the left hand side

5. Click on **Open raw editor**\
![raw editor button](images/secrets_json.png)

6. Copy the code snippet below and paste into the editor

    ```json
    {
    "NOTION_TOKEN": "your-notion-token-here",
    "CHECKBOX": "Done",
    "DUE_DATE": "Due Date",
    "RECUR_INTERVAL": "Recur Interval",
    "INVALID": "Invalid format",
    "ADDRESS": "https://your-own-address-here.repl.co"
    }
    ```

    ![raw editor](images/secrets_editor.png)
7. Replace each value with your own values and save

    - NOTION_TOKEN : get from step __ of **Setup Notion**
    - CHECKBOX : get from step __ of **Setup Notion**
    - DUE_DATE : get from step __ of **Setup Notion**
    - RECUR_INTERVAL : get from step __ of **Setup Notion**
    - INVALID : get from step __ of **Setup Notion**
    - ADDRESS :
      - option 1 : `https://{name-of-repl}.{your-username}.repl.co`
        - example: `https://recurtion.leannestodoming.repl.co`
      - option 2 : when you run your repl, a small browser should appear with the url on top ![repl url](images/repl_url.png)

8. Click on the **Run** button at the top of the screen ![run button](images/run_btn.png)

9. (Optional) If you want an even more reliable way to keep the program running 24/7, follow these [instructions](https://anidiots.guide/hosting/repl#the-automatic-ping).

10. Enjoy recurring tasks in Notion!

### Option 2 (advanced): self-hosted/VPS

- self-hosted
  - Raspberry Pi
  - computer that's always on
- VPS
  - [DigitalOcean](https://www.digitalocean.com/)
  - [Linode](https://www.linode.com/)
  - [OVH](https://www.ovhcloud.com/en/vps/)
  - etc...

To preform this option, you should be comfortable with using the command line interface. You should also have npm installed on the server you are using. If you don't have npm installed or you aren't sure, follow these [instructions](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

1. Clone this repository onto the server

    ```bash
    git clone https://github.com/LeanneStoDomingo/recurtion.git
    ```

2. Go into the new folder

    ```bash
    cd recurtion
    ```

3. Create the environment variables file (these instructions use nano but you can choose any cli text editor that you would like)

    ```bash
    nano .env
    ```

4. Type the code snippet from below into the file

    ```bash
    NOTION_TOKEN=your-notion-token-here
    CHECKBOX="Done"
    DUE_DATE="Due Date"
    RECUR_INTERVAL="Recur Interval"
    INVALID="Invalid format"
    PORT=3000
    ADDRESS=http://localhost:3000
    ```

5. Replace each value with your own values

    - NOTION_TOKEN : get from step __ of **Setup Notion**
    - CHECKBOX : get from step __ of **Setup Notion**
    - DUE_DATE : get from step __ of **Setup Notion**
    - RECUR_INTERVAL : get from step __ of **Setup Notion**
    - INVALID : get from step __ of **Setup Notion**

6. Save and exit the text editor by pressing `ctrl+x`
    - nano will ask if you want to save the file, so press `y`
    - it will then ask if you want to save it in the same file, so press `enter`

7. (Optional but recommended. Skip to **Step 10** if you don't want to do these optional steps) \
    Open index.js

    ```bash
    nano index.js
    ```

8. Delete everything after the `// web server` comment

    ```javascript
    // web server
    const PORT = process.env.PORT || 3000;

    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end('ok');
    });
    server.listen(PORT);

    setInterval(() => {
        http.get(process.env.ADDRESS);
        console.log('pinging server...');
    }, 1000 * 60 * 4);      // pings every 4 minutes

    ```

    ^ all of this should be deleted

9. Save and exit the text editor

10. Initialize node

    ```bash
    npm install
    ```

11. Start the program

    ```bash
    node index.js
    ```

    or

    ```bash
    npm start
    ```

12. Enjoy recurring tasks in Notion!

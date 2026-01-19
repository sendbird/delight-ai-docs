# Handoff preview

When you trigger a handoff from an AI agent conversation in a Development or Staging environment to Desk, the system displays a preview instead of creating an actual ticket. This preview shows  ticket information that would be sent to Desk based on your configured Desk rules.

{% hint style="info" %}
To configure Desk rules, go to **Settings > Desk > Rules** on Sendbird Dashboard.
{% endhint %}

{preview modal image}

***

## When to use

Use Handoff preview to:

* Verify the end-to-end handoff flow before deploying to production.
* Confirm which team will receive the ticket based on your Desk rules.
* Check what data will be passed to Desk.
* Debug handoff issues without creating real tickets.

***

## How to access

### Step 1: Trigger a handoff in a Development or Staging environment

{Handoff from AI agent to Desk in ticket view image}

### Step 2: Open the handoff preview

Click **View details for handoff preview** to open the handoff preview.

{Link in ticket view image}

### Step 3: Verify ticket information

Review the preview to confirm that ticket information is correctly configured based on your Desk rules.

***

## What's next

### Ready for production

Preview and verify your end-to-end handoff flow. Once confirmed, deploy to Production.

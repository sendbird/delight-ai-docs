---
hidden: true
---

# CSAT

Customer satisfaction (CSAT) survey helps you improve the overall user experience with Sendbird AI agent by monitoring and managing the agent's performance and interaction with users. At the end of every conversation, you can send out a resolution feedback (CRE) and CSAT survey to users and collect in-depth feedback using follow-up questions. The CSAT page under Build enables you to customize the survey to your service needs. Go to **Build > CSAT** in Sendbird AI agent dashboard to start creating a custom CSAT survey.

{% hint style="warning" %}
Such customization can be applied to [Messenger](channels/messenger/) and [Email](channels/email.md) channels only. If you wish to update the survey question for other channels such as [SMS](channels/sms.md) and [WhatsApp](channels/whatsapp.md), go to **Build >** **Channels** and configure the settings for each channel type. CSAT survey isn't supported in Voice channels.
{% endhint %}

<figure><img src="../../.gitbook/assets/image (98).png" alt=""><figcaption></figcaption></figure>

***

## How to customize

This guide walks you through the customization process for a CSAT survey.

1. Log in to Sendbird AI agent dashboard.
2. Select a Development agent from the AI agent list.
3. After choosing an AI agent to set a CSAT survey for, navigate to Build > CSAT in the left menu bar.
4. In the CSAT page, you can customize the survey as follows:

### Language

You can select a language in which the survey will be sent. The language used for this survey should match the language set to the test widget. Otherwise, the tester won't work properly.

### Survey type

There are two types of feedback survey for AI agent: customer **customer resolution evaluation (CRE)** and **customer satisfaction (CSAT)** **survey**. You can choose whether you want to ask both or just CSAT once the conversation is closed.

* CRE and CSAT
* CSAT only

#### Resolution feedback (CRE) survey&#x20;

The CRE is a survey asking users whether their inquiries have been resolved by AI agent. In this survey, you can customize:

* Question
* Positive feedback text
* Negative feedback text

<figure><img src="../../.gitbook/assets/image (102).png" alt="" width="563"><figcaption></figcaption></figure>

#### CSAT survey

The CSAT survey asks users to rate the service provided by AI agent on a scale of one to five, where one is the worst and five the best. Here, you can customize:&#x20;

* Question
* Rating icon
* Rating description text
* Follow-up questions by rating

<details>

<summary>What is a follow-up question?</summary>

A follow-up question is a conditional query that can be asked when the user selects a certain response option for the CSAT survey. Here's how to create a follow-up.

1. Select ratings for **If ranting is** and add your question to the box next to **ask**. \
   Take the screenshot below as an example. If a user rates their satisfaction with one of **1**, **2**, and **3**, they will be asked "What were you dissatisfied with?"
2. Select response type and add response options. The response type can be either a single answer or a paragraph. For single-answer questions, up to five options are allowed.
3. Determine whether the follow-up question will be required or optional. If required, check the **Required** box in the top-right corner of the section.

<figure><img src="../../.gitbook/assets/image (91).png" alt="" width="563"><figcaption></figcaption></figure>

</details>

<figure><img src="../../.gitbook/assets/image (103).png" alt="" width="563"><figcaption></figcaption></figure>

### Others

Besides the survey's language and content, you can also customize:

* Submit button label: the text for the **Submit** button.
* Confirmation message after submission: the text that will appear after the user clicks **Submit**.

<figure><img src="../../.gitbook/assets/image (104).png" alt="" width="563"><figcaption></figcaption></figure>

***

## Tester preview

On the right side of the survey section, there is **Tester** that shows a preview of the survey. Have a short conversation with AI agent on the tester and close it by clicking the stroke-through bubble button in the top-right corner. Then the CSAT survey you've set on the left panel will appear.

{% hint style="warning" %}
Make sure that the language set to the tester widget matches with the language used for the survey. Otherwise, the tester won't work properly.
{% endhint %}

<figure><img src="../../.gitbook/assets/image (12).png" alt="" width="563"><figcaption></figcaption></figure>

***

## Permission

In Sendbird AI agent dashboard, only the users with a permission can access and manage the CSAT survey settings. If you need to grant the access to certain roles, go to **Organization settings > Roles** and create a new permission set or update an existing set. [See our guide on Roles and permissions](../roles-and-permissions.md) to learn more.

<figure><img src="../../.gitbook/assets/image (92).png" alt="" width="563"><figcaption></figcaption></figure>

# Tools

Tools allow the AI agent to connect with external APIs to dynamically retrieve or send data. With tools, the agent can perform sensitive operations, such as validating a credit card, checking membership status, or canceling a subscription.<br>

Because tools connect the AI agent with external systems, compromised or misconfigured tool can become a primary attack vector, exposing critical backend infrastructure.

The following best practices are recommended to securely implement Tools.

***

### Server authentication

All communication between tools and your server must be authenticated to prevent spoofing:

* Header-based secret: A secret key is included in the request header. While simple to implement, this method is more vulnerable to man-in-the-middle attacks, as altered payloads may go undetected.
* X-SendBird-Signature validation: A request signature provided in the X-SendBird-Signature header ensures message integrity. We strongly recommend this method, as it allows servers to validate that the incoming request originated from Sendbird and that its contents remain unaltered.

{% hint style="info" %}
For detailed implementation guidance, see: [Verifying X-SendBird-Signature](https://sendbird.com/docs/chat/platform-api/v3/webhook/webhook-overview#2-headers-3-x-sendbird-signature).
{% endhint %}

### User validation

When sending a request from Tools, it provides the functionality to pass Sendbird user information. The server receiving this value must validate the user on the API server to confirm that the requesting user has the appropriate authorization to perform the given action.

For example, consider a tool that allows users to cancel an order. When the tool receives a cancellation request, your server must verify through a database check that the requesting user is indeed the owner of that order. Only after successful validation should the cancellation be executed.

This principle applies broadly: regardless of the tool’s purpose, the server must always enforce user-level validation before the requested action is processed.

***

### API endpoint security

External APIs used by tools can ultimately be accessed through the AI agent. Therefore, the API endpoints must be secured against common web-based attacks. Use the following checkpoints to ensure that endpoints used by tools have basic protective measures in place:

* Implement strong defenses against common web attacks such as injection, replay attacks, and denial-of-service.
* Ensure that responses do not include unnecessary data. Sensitive or excessive information in the response can inadvertently be exposed to the AI agent, increasing the attack surface.
* Apply the principle of least privilege to the server handling these requests. The server should only have access to the minimum resources required to fulfill the tool’s function.
* Maintain comprehensive server-side logging of API requests and responses, capturing details such as timestamps, requesting client identifiers, request parameters.

***

### Monitoring

Continuous monitoring is essential to detect misuse.

* Use Sendbird’s monitoring features to track unusual request patterns or anomalies.
* Regularly review your API server logs to identify suspicious usage, failed attempts, or signs of automated probing.

Effective monitoring transforms tools from a potential liability into a more controlled and auditable channel for sensitive operations.

<br>

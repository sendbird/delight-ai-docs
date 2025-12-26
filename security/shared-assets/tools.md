# Tools

Tools allows an AI agent to connect with external APIs to retrieve or send data dynamically. Using Tools, the agent can initiate sensitive operations such as validating a credit card, checking membership status, or canceling a subscription.

<figure><img src="../../.gitbook/assets/image (1) (1).png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
For more information, see: [Authentication for Tools](../../tutorials/authentication-for-tools.md)
{% endhint %}

Because Tools connect the AI agent to external systems, a compromised or misconfigured tool can become a primary attack vector, potentially exposing critical backend infrastructure. The following best practices help ensure Tools are implemented securely.

***

### Server authentication

All communication between Tools and your server must be authenticated to prevent spoofing.

#### Header-based secret

A secret key is included in the request header. While simple to implement, this method is more vulnerable to man-in-the-middle attacks, as altered payloads may go undetected.

#### X-Sendbird-Signature validation

A request signature provided in the `X-Sendbird-Signature` header ensures message integrity. This method allows your server to verify that the request originated from Sendbird and that its contents have not been altered.

{% hint style="info" %}
For more information, see: [Verifying X-Sendbird-Signature](https://sendbird.com/docs/chat/platform-api/v3/webhook/webhook-overview#2-headers-3-x-sendbird-signature).
{% endhint %}

***

### User validation

When a tool sends a request, it can include Sendbird user information. The receiving API server must validate this user to confirm they are authorized to perform the requested action.

For example, consider a tool that allows users to cancel an order. When the tool receives a cancellation request, your server must verify through a database check that the requesting user is indeed the owner of that order. Only after successful validation should the cancellation be executed.

{% hint style="info" %}
**Note:** Regardless of the tool’s purpose, the server must always enforce user-level validation before the requested action is processed.
{% endhint %}

***

### API endpoint security

External APIs invoked by Tools are indirectly accessible through the AI agent and must be protected against common web-based attacks. Ensure the following safeguards are in place:

* Implement strong defenses against common web attacks such as injection, replay attacks, and denial-of-service.
* Ensure that responses do not include unnecessary data. Sensitive or excessive information in the response can inadvertently be exposed to the AI agent, increasing the attack surface.
* Apply the principle of least privilege to the server handling these requests. The server should only have access to the minimum resources required to fulfill the tool’s function.
* Maintain comprehensive server-side logging of API requests and responses, capturing details such as timestamps, requesting client identifiers, and request parameters.

***

### Monitoring

Continuous monitoring is essential to detect misuse.

* Use Sendbird’s monitoring features to track unusual request patterns or anomalies.
* Regularly review your API server logs to identify suspicious usage, failed attempts, or signs of automated probing.

Effective monitoring ensures Tools remain a controlled and auditable mechanism for executing sensitive operations, rather than a security liability.<br>

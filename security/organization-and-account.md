# Organization and Account

Sendbird provides a set of features designed to enhance the security of organizations and user accounts. This section provides an overview of these features. Detailed configuration guidance is available in the corresponding documentation.

### Two-Factor Authentication

Two-factor authentication (2FA) is a secure authentication method that mandates users to verify their identity by providing two or more pieces of factors during login. One factor is something the user knows, such as their username and password. Other factors include something the user has on their device, such as an authenticator app or security key. By requiring multiple forms of verification, 2FA significantly reduces the risk of common threats such as phishing attacks and account takeovers.&#x20;

{% hint style="info" %}
For more information, refer to [Sendbird Docs](https://sendbird.com/docs/security/documentation/org-account/two-factor-authentication).
{% endhint %}

***

### Single Sign-On

Single sign-on (SSO) is a method of authentication that allows users to access various applications using a single login and set of credentials. For example, once users log in to your organization, they can seamlessly access all applications from the App Launcher. You have the option to configure your Sendbird organization to trust an external identity provider for user authentication, or you can set up a third-party application to depend on your organization for authentication.

{% hint style="info" %}
For more information, refer to [Sendbird Docs](https://sendbird.com/docs/security/documentation/org-account/single-sign-on).
{% endhint %}

***

### Restrict Login IP Addresses

Control user login access by defining a range of permitted IP addresses. If a login attempt is made from an IP address outside this specified range, it will be denied.

{% hint style="info" %}
For more information, refer to [Sendbird Docs](https://sendbird.com/docs/security/documentation/org-account/restrict-login-ip-addresses).
{% endhint %}

***

### Enforce Access Control

Sendbird assigns a unique email and password to each user, which they must enter at every login. As an admin user, you have the ability to configure various settings to ensure that your users' passwords are secure.

{% hint style="info" %}
For more information, refer to [Sendbird Docs](https://sendbird.com/docs/security/documentation/org-account/enforce-access-control).
{% endhint %}

***

### Roles and permissions

Custom roles and permissions provide the ability to manage user access within the Delight AI dashboard in a way that caters to your needs. They empower organizations to assign specific access rights to different teams or users, ensuring that they have the precise capabilities they need.

{% hint style="info" %}
For more information, refer to [Roles and permissions](../dashboard-guide/roles-and-permissions.md).
{% endhint %}

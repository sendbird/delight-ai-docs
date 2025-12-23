# Environment separation

Delight AI agent provides a clear separation between Development and Production environments to ensure safe testing and reliable deployment of agents.

<figure><img src="../.gitbook/assets/image (125).png" alt=""><figcaption></figcaption></figure>

***

### Development vs Production environments

When you create a new AI agent, it automatically comes with two environments:

* **Development** — a sandbox for testing, editing, and validating your agent before going live.
* **Production** — the live version users interact with.

Changes made in Development do not affect the live agent until they are explicitly deployed to Production. This separation helps prevent accidental disruptions and enables safer, more controlled release cycles.

***

### Release life cycle management

Delight provides role-based access controls to manage deployments to Production. Only users with the appropriate permissions can deploy agents, ensuring that release authority is limited to designated roles.

This approach aligns with standard software development practices by clearly separating responsibilities between Development and Production. Enforcing these controls reduces the risk of unauthorized changes and helps maintain stability and reliability in the Production environment.

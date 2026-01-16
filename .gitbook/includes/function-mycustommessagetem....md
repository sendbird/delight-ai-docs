---
title: function MyCustomMessageTem...
---

<pre class="language-typescript"><code class="lang-typescript"><strong>function MyCustomMessageTemplate({ extendedMessagePayload }) {
</strong>  const template = extendedMessagePayload?.custom_message_templates?.[0];

  if (!template) return null;

  switch (template.id) {
    case 'coupon_template':
      return &#x3C;CouponCards data={JSON.parse(template.response.content)} />;
    default:
      return &#x3C;FallbackUI />;
  }
}

const FallbackUI = () => &#x3C;div>Unsupported template type&#x3C;/div>;
</code></pre>

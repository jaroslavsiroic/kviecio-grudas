const config = require(`${__hooks}/config.js`);

module.exports = {
  subscribe: (record) => {
    $app.logger().info("newsletter sub", record);
    const apiKey = config.val("brevoapikey");
    const listId = config.val("brevolist");

    if (!apiKey) return;

    // In 0.24, JSON fields (like 'info') are automatically
    // converted to JS objects when using .get()
    const info = record.get("info") || {};

    try {
      const res = $http.send({
        url: "https://api.brevo.com/v3/contacts",
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          email: record.get("email"),
          attributes: {
            FIRSTNAME: record.get("name"),
            WANT2GETBOOKREAD: !!info.bookReadNewsletter,
            FRATERNITYSTATUS: info.areYouPartOfFraternity || "",
          },
          listIds: [parseInt(listId || 3)],
          updateEnabled: true,
        }),
      });

      if (res.statusCode >= 400) {
        $app.logger().debug("Brevo Response Error:", res.raw);
        console.log("Brevo Response Error:", res.raw);
      }
    } catch (err) {
      console.error("HTTP Request Failed:", err);
    }
  },
};

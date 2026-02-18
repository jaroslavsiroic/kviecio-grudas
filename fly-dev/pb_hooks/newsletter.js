const config = require(`${__hooks}/config.js`);

module.exports = {
  subscribe: (record) => {
    const apiKey = config.val("brevoapikey");
    const listId = config.val("brevolist");

    if (!apiKey) return;

    const info = new DynamicModel({
      bookReadNewsletter: true,
      areYouPartOfFraternity: "",
    });

    // 2. Unmarshal the field from the record into your model
    // This fills 'result' with the data from "someJsonField"
    record.unmarshalJSONField("info", info);

    try {
      const newsletterData = {
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
      };
      const res = $http.send(newsletterData);

      $app.logger().info("newsletter sub", newsletterData);

      if (res.statusCode >= 400) {
        $app.logger().debug("Brevo Response Error:", res.raw);
        console.log("Brevo Response Error:", res.raw);
      }
    } catch (err) {
      console.error("HTTP Request Failed:", err);
    }
  },
};

module.exports = {
  val: (id) => {
    try {
      // In v0.24, dao() is removed for common lookups
      const record = $app.findRecordById("app_config", id);
      return record.get("value");
    } catch (e) {
      // findRecordById throws an error if not found
      $app.logger().error(`Config ID "${id}" not found: ${e}`);
      console.error(`Config ID "${id}" not found: ${e}`);
      return null;
    }
  },
};

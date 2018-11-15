module.exports = {
  tableName: "tbl_file",
  attributes: {
    id: {
      type: "number",
      required: true
    },
    path: {
      type: "string",
      required: true
    },
    upload_time: {
      type: "string",
      required: true
    }
  }
};

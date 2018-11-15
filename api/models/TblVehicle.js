module.exports = {

    tableName: 'tbl_vehicle',
    attributes: {
        id: {
            type: "string",
            required: true
        },
        name: {
            type: "string",
            required: true
        },
        frame: {
            type: "string",
            required: true
        },
        powertrain: {
            type: "string",
            required: true
        },
        wheel: {
            type: "string",
            required: true
        },
        timestamp: {
            type: "string",
            required: true
        },
        file: {
            type: "string",
            required: true
        }
    }
};
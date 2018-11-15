/**
 * Index Controller
 *
 * @description :: Uploading XML file and processing it.
 * 
 */

var fs = require('fs-extra')
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var moment = require('moment');

module.exports = {
    uploadFile: function (req, res, next) {

        req.file("xml_file").upload({
            // dirname: require('path').resolve(sails.config.appPath, 'assets/images'),
            dirname: "C:\\Users\\kunal\\Desktop\\unfound\\assets\\uploads",
            // saveAs: function (file, cb) { cb(null, file.name); }
        },
            async function onUploadComplete(err, uploadedFiles) {
                if (err) return res.serverError(err);
                fs.readFile(uploadedFiles[0].fd, function (err, data) {
                    if (err) throw err;
                    var filePath = uploadedFiles[0].fd;
                    parser.parseString(data.toString(), async function (err, result) {
                        if (err) return res.serverError(err);

                        // var json1 = ; // Gives an error
                        var json = JSON.parse(JSON.stringify(result));
                        var vh = json["vehicles"]["vehicle"];
                        var fileID = await TblFile.count({});
                        fileID += 1;
                        var fileTime = moment(new Date()).format("DD-MM-YYYY HH:mm:ss");

                        await TblFile.create({
                            id: fileID,
                            path: filePath,
                            upload_time: fileTime
                        }).intercept(err => {
                            err.message = "Uh oh: " + err.message;
                            return err;
                        });


                        for (let index = 0; index < vh.length; index++) {
                            var vehicleName = "Undefined";
                            var vehicleId = vh[index]['id'][0];
                            var frame_material = vh[index]["frame"] ? vh[index]["frame"][0]["material"][0] : "Undefined";
                            var powertrain = vh[index]["powertrain"] ? Object.getOwnPropertyNames(vh[index]["powertrain"][0])[0]: "Undefined";
                            var wheels = vh[index]["wheels"] ? vh[index]["wheels"][0]["wheel"].length : 0;
                            
                            if (frame_material === "plastic") {
                              if (wheels === 0) {
                                if (powertrain === "bernoulli") {
                                  vehicleName = "Hang Glider";
                                }
                              } else if (wheels === 3) {
                                if (powertrain === "human") {
                                  vehicleName = "Big Wheel";
                                }
                                // for (let w = 0; w < vh[index]['wheels'][0].length; w++) {
                                // }
                              }
                            } else if (frame_material === "metal") {
                              if (wheels === 2) {
                                if (powertrain === "human") {
                                  vehicleName = "Bicycle";
                                } else if (powertrain === "internal_combustion") {
                                  vehicleName = "Motorcycle";
                                }
                              } else if (wheels === 4) {
                                if (powertrain === "internal_combustion") {
                                  vehicleName = "Car";
                                }
                              }
                            }

                            var timestamp = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
                           
                            await TblVehicle.create({
                                id: vehicleId,
                                name: vehicleName,
                                frame: frame_material,
                                powertrain: powertrain,
                                wheel: wheels,
                                timestamp: timestamp,
                                file: filePath
                            }).intercept((err) => {
                                // Return a modified error here (or a special exit signal)
                                // and .create() will throw that instead
                                err.message = 'Uh oh: ' + err.message;
                                return err;
                            });
                            
                            await TblVehicle.create({
                                id: vehicleId,
                                name: vehicleName,
                                frame: frame_material,
                                powertrain: powertrain,
                                wheel: wheels,
                                timestamp: timestamp,
                                file: fileID
                            }).intercept((err) => {
                                // Return a modified error here (or a special exit signal)
                                // and .create() will throw that instead
                                err.message = 'Uh oh: ' + err.message;
                                return err;
                            });
                        }

                        return res.redirect(`/result?id=${fileID}`)


                    });

                });

                //  IF ERROR Return and send 500 error with error
                // fs.readFile("test.txt", function (err, data) {
                //     if (err) throw err;
                //     console.log(data.toString());

                // });
            });
    },

    resultPage: async function (req, res, next) {

        var fileID = req.param('id');
        if (fileID === undefined || fileID === '') {
            var files = await TblFile.find({});
            return res.view("pages/result", { files });
        }
        await sails.sendNativeQuery(`SELECT name,file, COUNT(name) as cnt FROM tbl_vehicle WHERE file=${fileID} GROUP BY name ORDER BY COUNT(name);`, async (err, summary) => {

            var vehicles = await TblVehicle.find({ file: fileID });
            var files = await TblFile.find({});
            return res.view("pages/result", { vehicles, files, summary: summary.rows, fileID });
        });
    },

    fetchFile: async function (req, res, next) {
        var fileID = req.param('id');
        var file = await TblFile.find({ id: fileID });

        fs.readFile(file[0].path, function (err, data) {
            return res.send(data);
        });

    },

}
const Rent_Tracking = require('../models/RentalTrackingModel');
const nodeCron = require("node-cron");
const PropertyTenant = require('../models/PropertyTenantModel');
const Property = require('../models/PropertyModel');
var mongoose = require('mongoose');


const Rent_Tracking_Up_todate = async (req, res, next) => {
  // Getting data with PropertyTenant collection start here
  const getPropertyTenant = await PropertyTenant.find();
  const propertyTenant_id = getPropertyTenant.map(data => data._id)
  const rowid = propertyTenant_id.toString();

  // Getting data with PropertyTenant collection end here here

  // start tracking collection
  const permtent_id = rowid.split(',').map(data => data)

  const rent = permtent_id.map((data, i) => {

    const tracking = new Rent_Tracking({
      propertyTenant_id: data,
      status: req?.body?.status
    });
    return tracking

  })

  rent.map(async (data) => {
    if (data) {
      return items = await data.save();
    }
  })

  // end tracking collection

  // checking rental track collection records start here
  const rentaltrack = await Rent_Tracking.find();
  // checking rental track collection records end here

  res.send({
    total: rentaltrack.length,
    message: `${rentaltrack.length} Record Generated Successfully`,
    status: 200,
    data: [`${rent.length} Current_Record_Generate`, rent, 'Total_rental_record', rentaltrack]
  })
}

// cron job code start here
nodeCron.schedule('0 0 1-15 * *', Rent_Tracking_Up_todate, null, true, "Asia/Kolkata");
// cron job code end here

const Rental_Tracking_Updates_Get = async (req, res) => {

  const agg = [
    {
      '$lookup': {
        'from': 'propertytenants',
        'localField': 'propertyTenant_id',
        'foreignField': '_id',
        'as': 'result'
      }
    }, {
      '$unwind': {
        'path': '$result'
      }
    }, {
      '$lookup': {
        'from': 'properties',
        'localField': 'result.property_id',
        'foreignField': '_id',
        'as': 'Property_data'
      }
    }, {
      '$unwind': {
        'path': '$Property_data'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'result.userid',
        'foreignField': '_id',
        'as': 'Users_data'
      }
    }, {
      '$unwind': {
        'path': '$Users_data'
      }
    }, {
      '$sort': {
        'createdAt': -1
      }
    }
  ]

  const Data = await Rent_Tracking.aggregate(agg)


  const FinalData = Data.map((data) => {
    const { _id, propertyTenant_id, __v, result, ...CompleteDetails } = data
    return CompleteDetails;
  })

  res.send({
    total: FinalData.length,
    message: `${FinalData.length} Record Fetch Successfully`,
    status: 200,
    data: FinalData
  })

}


const For_Each_User_Info = async (req, res) => {

  const Id = req.params.id;
  const P_id = req.query.P_id;
  const U_id = req.query.U_id;

  var property_Id = mongoose.Types.ObjectId(`${P_id}`);
  var user_Id = mongoose.Types.ObjectId(`${U_id}`);
  var propertyTenant = mongoose.Types.ObjectId(`${Id}`);

  const agg = [
    {
      '$match': {
        'propertyTenant_id': propertyTenant
      }
    }, {
      '$lookup': {
        'from': 'propertytenants',
        'localField': 'propertyTenant_id',
        'foreignField': '_id',
        'as': 'result'
      }
    }, {
      '$unwind': {
        'path': '$result'
      }
    }, {
      '$match': {
        'result.property_id': property_Id,
        'result.userid': user_Id
      }
    }, {
      '$lookup': {
        'from': 'properties',
        'localField': 'result.property_id',
        'foreignField': '_id',
        'as': 'property'
      }
    }, {
      '$lookup': {
        'from': 'users',
        'localField': 'result.userid',
        'foreignField': '_id',
        'as': 'user'
      }
    }, {
      '$unwind': {
        'path': '$property'
      }
    }, {
      '$unwind': {
        'path': '$user'
      }
    }, {
      '$sort': {
        'property.date': -1
      }
    }
  ]

  const Data = await Rent_Tracking.aggregate(agg)
  res.send({
    message: "Data Fetched",
    status: 200,
    data: Data
  })
}

module.exports = {
  Rent_Tracking_Up_todate,
  Rental_Tracking_Updates_Get,
  For_Each_User_Info
}
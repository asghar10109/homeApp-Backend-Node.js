const Rent_Tracking = require('../models/RentalTrackingModel');
const nodeCron = require("node-cron");
const PropertyTenant = require('../models/PropertyTenantModel');
var mongoose = require('mongoose');


const Rent_Tracking_Up_todate = async (req,res,next ) => {
    // Getting data with PropertyTenant collection start here
    const getPropertyTenant = await PropertyTenant.find();
    const propertyTenant_id = getPropertyTenant.map(data =>  data._id)
    const rowid = propertyTenant_id.toString();

    // Getting data with PropertyTenant collection end here here
    
    // start tracking collection
    const permtent_id =  rowid.split(',').map(data => data)
    
    const rent = permtent_id.map((data,i) => {

        const tracking = new Rent_Tracking({
            propertyTenant_id : data,
            status: req?.body?.status
        });
        return tracking

    })
    
     rent.map(async(data) => {
        if(data){
            return items = await data.save();
        }
    })
   
        // end tracking collection
    
    // checking rental track collection records start here
    const rentaltrack = await Rent_Tracking.find();
    // checking rental track collection records end here

    res.send({
        total: rentaltrack.length,
        message:  `${rentaltrack.length} Record Generated Successfully`,
        status:200,
        data: [ `${rent.length} Current_Record_Generate` , rent , 'Total_rental_record' , rentaltrack]
    })
}

// cron job code start here
 nodeCron.schedule( '0 0 1-15 * *' ,Rent_Tracking_Up_todate ,null,true,"Asia/Kolkata" );
// cron job code end here

const Rental_Tracking_Updates_Get = async (req,res) => {

    const GetRentalData = await Rent_Tracking.find()
    .populate({
        path :'propertyTenant_id' , 
        populate:{ path:'property_id'}
    })
    const GetRentalData2 = await Rent_Tracking.find()
    .populate({
        path :'propertyTenant_id' , 
        populate:{ path:'userid'}
    })


   const Property_Data = GetRentalData.map(data => {
       const property = data?.propertyTenant_id?.property_id;
       return property
   })

   const User_data = GetRentalData2.map((data) => {
    const User_Data = data.propertyTenant_id.userid;
    const date = data.propertyTenant_id.date;
    return { _id : data._id , User_Data , date  }
   })
   

   const Data1 = [...new Set(Property_Data)]
   const Data2 = [...new Set(User_data)]

   res.send({
    message: `${Data2.length} Users Record Fetch and ${Data1.length} Properties Record Fetch Successfully `,
    status:200,
    data: { Property : Data1 , User : Data2}
   })
 

}


const For_Each_User_Info = async (req,res) => {

    const Id = req.params.id;
    const P_id = req.query.P_id;
    const U_id = req.query.U_id;
    
    var property_Id = mongoose.Types.ObjectId(`${P_id}`);
    var user_Id = mongoose.Types.ObjectId(`${U_id}`);
    var propertyTenant = mongoose.Types.ObjectId(`${Id}`);
    
    console.log(P_id , property_Id)

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
        message:"Data Fetched",
        status:200,
        data:Data
      })
}

module.exports = {
    Rent_Tracking_Up_todate,
    Rental_Tracking_Updates_Get,
    For_Each_User_Info
}
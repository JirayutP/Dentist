const Dentist = require('../models/Dentist');

//@desc     Get all dentists
//@route    Get /api/v1/dentists
//@access   Public
exports.getDentists= async (req,res,next) => {
    let query;

    //Copy req.query
    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields=['select', 'sort'];

    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    //Create query string
    let queryStr=JSON.stringify(reqQuery);

    //Creat operators ($gt, $gte, $ect)
    queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);

    //finding resource
    query=Dentist.find(JSON.parse(queryStr));

    //select fields
    if(req.query.select){
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }
    //sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    }else{
        query=query.sort('-createdAt');
    }

    try {
        //Excuting query
        const hospitals = await query;
        res.status(200).json({success:true, count:hospitals.length, data:hospitals});
    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Get single dentists
//@route    Get /api/v1/sentists/:id
//@access   Public
exports.getDentist=async (req,res,next) => {
    try {
        const dentist = await Dentist.findById(req.params.id);

        if(!dentist){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:dentist});
    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Create new dentists
//@route    Post /api/v1/dentists
//@access   Private
exports.createDentist=async (req,res,next) => {
    const dentist = await Dentist.create(req.body);
    res.status(201).json({
        success:true, 
        data:dentist
    });
};

//@desc     Update dentists
//@route    Put /api/v1/dentists/:id
//@access   Private
exports.updateDentist=async (req,res,next) => {
    try {
        const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!dentist){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:dentist});
    }catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Delete dentists
//@route    Delete /api/v1/dentists/:id
//@access   Private
exports.deleteDentist=async (req,res,next) => {
    try {
        const dentist = await Dentist.findById(req.params.id);

        if(!dentist){
            return res.status(404).json({
                success:false,
                message:`Dentist not found with id of ${req.parqms.id}`
            });
        }

        await dentist.deleteOne();
        res.status(200).json({success:true, data:{}});
    }catch(err){
        res.status(400).json({success:false});
    }
};
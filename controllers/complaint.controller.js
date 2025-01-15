exports.submitComplaint = async (req, res) => {
  try {
    const complaintData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      nic: req.body.nic,
      phone: req.body.phone,
      address: req.body.address,
      category: req.body.category,
      subCategory: req.body.subCategory,
      details: req.body.details,
      location: req.body.location,
      date: req.body.date,
      time: req.body.time,
      files: req.files && req.files.length > 0
  ? req.files.map(file => ({
      fileName: file.originalname,
      fileSize: file.size,
      filePath: file.path,
    }))
  : [],

    };

    console.log(complaintData.files); // Check the structure of files

    const newComplaint = new Complaint(complaintData);
    await newComplaint.save();

    res.status(200).json({ message: 'Complaint submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error submitting complaint' });
  }
};

const Address = require("../models/Address");

// ✅ Add New Address
exports.addAddress = async (req, res) => {
  try {
    const { isDefault, phoneNumber, ...addressData } = req.body; // Extract phoneNumber
    const userId = req.user.id;

    if (isDefault) await Address.updateMany({ userId }, { isDefault: false });

    // Map phoneNumber to phone
    const address = await new Address({ 
      userId, 
      isDefault, 
      phone: phoneNumber, // Map phoneNumber to phone
      ...addressData 
    }).save();

    res.status(201).json({ message: "Address added", address });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Failed to save address" });
  }
};

// Get All Addresses for User
exports.getAllAddresses = async (req, res) => {
  try {
    res.json(await Address.find({ userId: req.user.id }));
  } catch (error) {
    res.json({ message: "Error" });
  }
};

// Get Address by ID
exports.getAddressById = async (req, res) => {
  try {
    res.json(await Address.findOne({ _id: req.params.id, userId: req.user.id }) || { message: "Not found" });
  } catch (error) {
    res.json({ message: "Error" });
  }
};

//  Update Address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { isDefault, phoneNumber, ...updateData } = req.body;
    const userId = req.user.id;

    console.log("Incoming update data:", req.body); // Debugging

    if (isDefault) await Address.updateMany({ userId }, { isDefault: false });

    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      { isDefault, phone: phoneNumber, ...updateData }, // Map phoneNumber to phone
      { new: true }
    );

    console.log("Updated address:", address); // Debugging

    res.json(address || { message: "Not found" });
  } catch (error) {
    console.error("Error updating address:", error); // Debugging
    res.status(500).json({ message: "Error updating address" });
  }
};
// Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const deleted = await Address.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json(deleted ? { message: "Deleted" } : { message: "Not found" });
  } catch (error) {
    res.json({ message: "Error" });
  }
};

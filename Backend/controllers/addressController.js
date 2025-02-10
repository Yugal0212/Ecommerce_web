const Address = require("../models/Address");

// ✅ Add New Address
exports.addAddress = async (req, res) => {
  try {
    const { isDefault, ...addressData } = req.body;
    const userId = req.user.id;

    if (isDefault) await Address.updateMany({ userId }, { isDefault: false });

    const address = await new Address({ userId, isDefault, ...addressData }).save();
    res.json({ message: "Address added", address });
  } catch (error) {
    res.json({ message: "Error" });
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
    const { isDefault, ...updateData } = req.body;
    const userId = req.user.id;

    if (isDefault) await Address.updateMany({ userId }, { isDefault: false });

    const address = await Address.findOneAndUpdate({ _id: id, userId }, { isDefault, ...updateData }, { new: true });
    res.json(address || { message: "Not found" });
  } catch (error) {
    res.json({ message: "Error" });
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

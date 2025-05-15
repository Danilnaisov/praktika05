import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Название отделения обязательно"],
    unique: true,
  },
  code: {
    type: String,
    required: [true, "Код отделения обязателен"],
    unique: true,
    uppercase: true,
    minlength: [2, "Код должен быть не менее 2 символов"],
    maxlength: [5, "Код должен быть не более 5 символов"],
  },
});

export default mongoose.models.Department ||
  mongoose.model("Department", departmentSchema);

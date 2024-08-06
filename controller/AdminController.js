
class AdminController {
  static AdminDashboard = async (req, res) => {
    try {
      res.render("Admin/adminDashboard");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = AdminController;

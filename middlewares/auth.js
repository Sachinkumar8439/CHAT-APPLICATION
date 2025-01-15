const islogin = async (req, res, next) => {
    try {
      if (!req.session.user) {
        return res.redirect("/"); // Redirect to login if not logged in
      }
      next();
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  };
  
  const islogout = async (req, res, next) => {
    try {
      if (req.session.user) {
        return res.redirect("/dashboard"); // Redirect to dashboard if logged in
      }
      next();
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  };
  
  module.exports = {
    islogin,
    islogout,
  };
  
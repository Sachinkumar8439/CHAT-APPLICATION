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
        return res.redirect("/dashboard"); 
      }
      next();
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  };

  const isemail = async (req, res, next) => {
    try {
      if (!req.session.email) {
        return res.redirect("/forgetpassword");n
      }
      next();
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  };
  const isotp = async (req, res, next) => {
    try {
      if (!req.session.otp) {
        return res.redirect("/varification");n
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
    isemail,
    isotp,
  };
  
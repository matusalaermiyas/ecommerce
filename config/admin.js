const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')

const bcrypt = require('bcryptjs')

const { Admin, Orders, Products, Rates,  Users} = require('../models');

AdminJS.registerAdapter(AdminJSMongoose)

const adminJs = new AdminJS({
  resources: [
      {resource: Products},
      {resource: Orders},
      {resource: Users},
      {resource: Rates},
      {resource: Admin}
  ],
  rootPath: '/admin',
})

const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
      const admin = await Admin.findOne({ email })

      if(admin)
      {
        const matched = await bcrypt.compare(password, admin.password);

        if(matched) return admin;
        
      }
      
      return false;
    },
    cookiePassword: process.env.ADMIN_COOKIE_PASSWORD,
  })

module.exports = {
    adminJs, router
}
# API Documentation

## Authentication Endpoints

### 1. User Login
*Endpoint:* POST /api/user/login  
*Description:* Regular user login  
*Auth Required:* No

*Request Body:*
```json
{
  "phone": "9876543210",
  "device_token": "optional",
  "device_type": "android|ios|web"
}
```

*Response:*
```json
{
  "status": true,
  "message": "User logged in successfully.",
  "token": "sanctum_token_here",
  "user": { ... }
}
```

---

### 2. User Logout
*Endpoint:* POST /api/user/logout  
*Description:* User logout  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "message": "User logged out successfully"
}
```

---

## OTP Management

### 1. Send OTP
*Endpoint:* POST /api/send-otp  
*Description:* Send OTP to phone number  
*Auth Required:* No

*Request Body:*
```json
{
  "phone": "9876543210"
}
```

*Response:*
```json
{
  "status": true,
  "message": "OTP sent successfully",
  "data": {
    "phone": "9876543210",
    "message_id": "msg_1234567890",
    "test_mode": false
  }
}
```

---

### 2. Verify OTP
*Endpoint:* POST /api/verify-otp  
*Description:* Verify OTP and login/register user  
*Auth Required:* No

*Request Body:*
```json
{
  "phone": "9876543210",
  "otp": "1234",
  "device_token": "optional",
  "device_type": "android|ios|web"
}
```

*Response:*
```json
{
  "status": true,
  "message": "OTP verified successfully",
  "data": {
    "user": { ... },
    "token": "sanctum_token_here",
    "token_type": "Bearer"
  }
}
```

---

### 3. Resend OTP
*Endpoint:* POST /api/resend-otp  
*Description:* Resend OTP to phone number  
*Auth Required:* No

*Request Body:*
```json
{
  "phone": "9876543210"
}
```

*Response:*
```json
{
  "status": true,
  "message": "OTP resent successfully",
  "data": {
    "phone": "9876543210",
    "message_id": "msg_1234567890",
    "test_mode": false
  }
}
```

---

### 4. Check OTP Status
*Endpoint:* POST /api/check-otp-status  
*Description:* Check if active OTP exists for phone  
*Auth Required:* No

*Request Body:*
```json
{
  "phone": "9876543210"
}
```

*Response:*
```json
{
  "status": true,
  "data": {
    "has_active_otp": true,
    "time_left_seconds": 240,
    "expires_at": "2024-01-01T12:05:00.000000Z"
  }
}
```

---

### 5. Get SMS Status
*Endpoint:* POST /api/sms-status  
*Description:* Get SMS delivery status  
*Auth Required:* No

*Request Body:*
```json
{
  "message_id": "msg_1234567890"
}
```

*Response:*
```json
{
  "status": true,
  "data": {
    "response": "...",
    "message_id": "msg_1234567890"
  }
}
```

---

### 6. Test OTP (Development)
*Endpoint:* GET /api/test-otp/{phone}  
*Description:* Test OTP generation  
*Auth Required:* No

*Response:*
```json
{
  "status": true,
  "message": "OTP test successful",
  "data": {
    "phone": "9876543210",
    "otp": "1234",
    "expires_at": "...",
    "is_verified": false
  }
}
```

---

### 7. Test SMS (Development)
*Endpoint:* POST /api/test-sms  
*Description:* Test SMS sending  
*Auth Required:* No

*Request Body:*
```json
{
  "mobile": "9876543210"
}
```

---

## User Management

### 1. User Registration
*Endpoint:* POST /api/user/register  
*Description:* Register new user  
*Auth Required:* No

*Request Body:*
```json
{
  "name": "User Name",
  "phone": "9876543210",
  "address": "Address here",
  "city": "Delhi",
  "device_token": "optional",
  "device_type": "android|ios|web"
}
```

*Response:*
```json
{
  "status": true,
  "message": "User registered successfully!",
  "data": { ... },
  "token": "sanctum_token_here"
}
```

---

### 2. Update Profile
*Endpoint:* POST /api/update/profile  
*Description:* Update user profile  
*Auth Required:* Yes (Bearer Token)

*Request Body (multipart/form-data):*

- user_id: 1
- name: "optional"
- email: "optional"
- phone: "optional"
- city: "optional"
- lat: "optional"
- long: "optional"
- address: "optional"
- profile_img: (file - optional)

*Response:*
```json
{
  "status": true,
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

## Category & Subcategory

### 1. Get All Categories
*Endpoint:* GET /api/category  
*Description:* Fetch all categories (excluding special categories)  
*Auth Required:* No

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Category Fetch Successfully!"
}
```

---

### 2. Get Subcategories by Category ID
*Endpoint:* GET /api/category/{id}/subcategories  
*Description:* Get subcategories for a specific category  
*Auth Required:* No

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 3. Get All Subcategories
*Endpoint:* GET /api/category/all/subcategories  
*Description:* Get all subcategories  
*Auth Required:* No

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 4. Get Subchild Categories
*Endpoint:* GET /api/category/subchild/{id}  
*Description:* Get child subcategories  
*Auth Required:* No

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Child Fetch Successfully !"
}
```

---

### 5. Get All Subcategories (Alternative)
*Endpoint:* GET /api/subcategory/all  
*Description:* Get all subcategories (public endpoint)  
*Auth Required:* No

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 6. Get Wedding Categories
*Endpoint:* GET /api/fetch/wedding/category  
*Description:* Get wedding-related categories  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ]
}
```

---

### 7. Get Popular Categories
*Endpoint:* GET /api/fetch/popular/categories  
*Description:* Get popular categories  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Popular Category Fetch Successfully !"
}
```

---

### 8. Get Professional Services
*Endpoint:* GET /api/fetch/profesional/service  
*Description:* Get professional services subcategories  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 9. Get Rental Services
*Endpoint:* GET /api/fetch/rental/service  
*Description:* Get rental services subcategories  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 10. Get Some Categories
*Endpoint:* GET /api/fetch/some/categories  
*Description:* Get "Some Categories" subcategories  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 11. Get Beauty Care
*Endpoint:* GET /api/fetch/beauty/care  
*Description:* Get Beauty Care subcategories  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 12. Get Trending Categories
*Endpoint:* GET /api/fetch/trending/categories  
*Description:* Get trending categories subcategories  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 13. Get Home Services
*Endpoint:* GET /api/fetch/home/services  
*Description:* Get Home Services subcategories  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 14. Get Health & Fitness
*Endpoint:* GET /api/fetch/health/fitness  
*Description:* Get Health & Fitness subcategories  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Sub Category Fetch Successfully !"
}
```

---

### 15. Get Subscriptions
*Endpoint:* GET /api/fetch/subscriptions  
*Description:* Get all subscription plans  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Subscriptions Fetch Successfully"
}
```

---

## Vendor Management

### 1. Fetch Vendors with Location
*Endpoint:* POST /api/fetch/vendor  
*Description:* Get vendors by location and subcategory  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "lat": 28.7041,
  "lng": 77.1025,
  "subcat_id": 1,
  "filter": "nearby|top-rated|available"
}
```

*Response:*
```json
{
  "status": true,
  "message": "Vendors found successfully",
  "data": [
    {
      "id": 1,
      "name": "Vendor Name",
      "distance": 2.5,
      "avg_rating": 4.5,
      "total_reviews": 10,
      "service_names": ["Service 1", "Service 2"],
      ...
    }
  ]
}
```

---

### 2. Get Vendor Details
*Endpoint:* GET /api/fetch/vendor/detail/{id}  
*Description:* Get detailed vendor information  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "Vendor Name",
    "service": [ ... ],
    "review": [ ... ],
    "subcategory": { ... },
    "slot": [ ... ],
    ...
  },
  "message": "Vendor Detail Fetch Successfully"
}
```

---

## Services

### 1. Get All Services
*Endpoint:* GET /api/services  
*Description:* Get all services  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "message": "Service Fetch successfully",
  "data": [ ... ]
}
```

---

### 2. Create Service
*Endpoint:* POST /api/services  
*Description:* Create a new service  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "vendor_id": 1,
  "cat_id": 1,
  "subcat_id": 1,
  "service_name": "Service Name",
  "service_description": "Description"
}
```

*Response:*
```json
{
  "status": true,
  "message": "Service created successfully",
  "data": { ... }
}
```

---

### 3. Get Service by ID
*Endpoint:* GET /api/services/{id}  
*Description:* Get service details  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "message": "Service created successfully",
  "data": { ... }
}
```

---

### 4. Update Service
*Endpoint:* PUT /api/services/{id}  
*Description:* Update service  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "vendor_id": 1,
  "cat_id": 1,
  "subcat_id": 1,
  "service_name": "Updated Name",
  "service_description": "Updated Description"
}
```

*Response:*
```json
{
  "status": true,
  "message": "Service updated successfully",
  "data": { ... }
}
```

---

### 5. Delete Service
*Endpoint:* DELETE /api/services/{id}  
*Description:* Delete service  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "message": "Service deleted successfully"
}
```

---

## Reviews

### 1. Add Review
*Endpoint:* POST /api/reviews  
*Description:* Add review for vendor  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "vendor_id": 1,
  "review": "Great service!",
  "star": 5
}
```

*Response:*
```json
{
  "message": "Review submitted successfully",
  "data": { ... }
}
```

---

### 2. Get Vendor Reviews
*Endpoint:* GET /api/vendor/reviews/{vendor_id}  
*Description:* Get all reviews for a vendor  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "vendor_id": 1,
  "reviews": [ ... ]
}
```

---

### 3. Get User Reviews
*Endpoint:* GET /api/user/reviews  
*Description:* Get all reviews by logged-in user  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "user_id": 1,
  "reviews": [ ... ]
}
```

---

## Leads

### 1. Create Lead
*Endpoint:* POST /api/leads  
*Description:* Create a lead and distribute to vendors  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "user_id": 1,
  "subcat_id": 1,
  "date": "2024-01-15",
  "lat": 28.7041,
  "long": 77.1025
}
```

*Response:*
```json
{
  "success": true,
  "message": "Lead created and distributed to vendors",
  "lead_id": 1,
  "vendors_assigned": [1, 2, 3]
}
```

---

### 2. Get Leads for Vendor
*Endpoint:* GET /api/leads/{vendor_id}  
*Description:* Get all leads assigned to a vendor  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": [ ... ]
}
```

---

## Enquiries

### 1. Create Enquiry
*Endpoint:* POST /api/enquires  
*Description:* Create an enquiry  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "user_id": 1,
  "vendor_id": 1,
  "date": "2024-01-15"
}
```

*Response:*
```json
{
  "status": "success",
  "message": "Enquiry created successfully",
  "data": { ... }
}
```

---

### 2. Get Enquiries by Vendor
*Endpoint:* GET /api/enquires/vendor/{vendor_id}  
*Description:* Get all enquiries for a vendor  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": "success",
  "message": "Enquiries fetched successfully",
  "data": [ ... ]
}
```

---

### 3. Get User Enquiries
*Endpoint:* GET /api/enquires/user  
*Description:* Get all enquiries created by the logged-in user. Returns vendor ID and vendor name for each enquiry.  
*Auth Required:* Yes (Bearer Token)

*Request Body:* None (User ID is extracted from Bearer Token)

*Response:*
```json
{
  "status": "success",
  "message": "Enquiries fetched successfully",
  "data": [
    {
      "id": 44,
      "user_id": 255,
      "vendor_id": 243,
      "date": "2024-12-20",
      "created_at": "2024-12-16T10:02:15.000000Z",
      "updated_at": "2024-12-16T10:02:15.000000Z",
      "vendor": {
        "id": 243,
        "vendor_id": 243,
        "name": "sv outlets",
        "vendor_name": "sv outlets",
        "brand_name": "SV Outlets",
        "phone": "6261096283",
        "address": "Palasia",
        "city": "Indore"
      }
    },
    {
      "id": 43,
      "user_id": 255,
      "vendor_id": 1,
      "date": "2024-12-25",
      "created_at": "2024-12-15T05:37:27.000000Z",
      "updated_at": "2024-12-15T05:37:27.000000Z",
      "vendor": {
        "id": 1,
        "vendor_id": 1,
        "name": "Wedding Planners",
        "vendor_name": "Wedding Planners",
        "brand_name": "Dream Wedding Services",
        "phone": "9876543210",
        "address": "MG Road",
        "city": "Indore"
      }
    }
  ]
}
```

*Response Fields:*
- `vendor_id`: Vendor ID (in enquiry object and vendor object)
- `vendor.name` or `vendor.vendor_name`: Vendor name
- `vendor.brand_name`: Vendor brand name (if available)
- `vendor.id`: Vendor ID (same as vendor_id)

*Error Response:*
```json
{
  "status": "error",
  "message": "Unauthorized. Please login.",
  "error": "Token not found"
}
```

---

## Album Management

### 1. Add Album Images
*Endpoint:* POST /api/user/album/add  
*Description:* Add images to user album  
*Auth Required:* Yes (Bearer Token)

*Request Body (multipart/form-data):*

- user_id: 1
- album[]: (files - multiple)

*Response:*
```json
{
  "status": true,
  "message": "Album images added successfully.",
  "album": [ ... ]
}
```

---

### 2. Get Album Images
*Endpoint:* GET /api/user/album  
*Description:* Get user's album images  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "album": [ ... ]
}
```

---

### 3. Upload Album (Alternative)
*Endpoint:* POST /api/album/upload  
*Description:* Upload album images (alternative endpoint)  
*Auth Required:* Yes (Bearer Token)

---

### 4. Delete Album Image
*Endpoint:* POST /api/album/delete  
*Description:* Delete image from album  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "user_id": 1,
  "image": "uploads/album/image.jpg"
}
```

*Response:*
```json
{
  "status": true,
  "message": "Image deleted successfully.",
  "album": [ ... ]
}
```

---

## Payment

### 1. Create Payment Order
*Endpoint:* POST /api/payment/create-order  
*Description:* Create Razorpay order for subscription  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "vendor_id": 1,
  "subscription_id": 1
}
```

*Response:*
```json
{
  "order_id": "order_xxx",
  "razorpay_key": "rzp_test_xxx",
  "amount": 1000,
  "currency": "INR"
}
```

---

### 2. Payment Success
*Endpoint:* POST /api/payment/success  
*Description:* Handle successful payment  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "vendor_id": 1,
  "subscription_id": 1,
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature_xxx"
}
```

*Response:*
```json
{
  "message": "Payment successful and subscription activated."
}
```

---

## Notifications

### 1. Register Device Token
*Endpoint:* POST /api/device-token  
*Description:* Register device token for push notifications  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "token": "fcm_token_here",
  "device_type": "android|ios|web"
}
```

*Response:*
```json
{
  "status": true,
  "message": "Device token registered",
  "data": { ... }
}
```

---

### 2. Send Offer Notification
*Endpoint:* POST /api/notify/offers  
*Description:* Send offer notifications to vendors  
*Auth Required:* Yes (Bearer Token)

*Request Body:*
```json
{
  "vendor_ids": [1, 2, 3],
  "title": "Special Offer",
  "body": "Get 50% off",
  "data": {}
}
```

*Response:*
```json
{
  "status": true,
  "message": "Offer notifications sent"
}
```

---

### 3. Get Vendor Notifications
*Endpoint:* GET /api/vendor/notifications  
*Description:* Get all notifications for logged-in vendor  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ]
}
```

---

### 4. Mark Notification as Read
*Endpoint:* POST /api/vendor/notifications/{id}/read  
*Description:* Mark notification as read  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "message": "Notification marked as read"
}
```

---

### 5. Get Notification Config Status
*Endpoint:* GET /api/notify/config  
*Description:* Check Firebase notification configuration  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": {
    "has_project_id": true,
    "has_server_key": true,
    "has_credentials_path": true,
    "credentials_file_exists": true
  }
}
```

---

## Banners & Pages

### 1. Get All Banners
*Endpoint:* GET /api/fetch/banner  
*Description:* Get all banners  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "Banner Fetch Successfully"
}
```

---

### 2. Get Homepage Banners
*Endpoint:* GET /api/fetch/homepage/banner  
*Description:* Get homepage banners  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "HomePage Banner Fetch Successfully !"
}
```

---

### 3. Get Wedding Banners
*Endpoint:* GET /api/fetch/wedding/banner  
*Description:* Get wedding banners  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "status": true,
  "data": [ ... ],
  "message": "HomePage Banner Fetch Successfully !"
}
```

---

### 4. Get All Pages
*Endpoint:* GET /api/fetch/pages  
*Description:* Get all pages  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

### 5. Get Page by ID
*Endpoint:* GET /api/fetch/pages/{id}  
*Description:* Get specific page  
*Auth Required:* Yes (Bearer Token)

*Response:*
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Search

### 1. Search
*Endpoint:* GET /api/search?keyword=search_term  
*Description:* Search subcategories  
*Auth Required:* Yes (Bearer Token)

*Query Parameters:*
- keyword: Search term (required)

*Response:*
```json
{
  "success": true,
  "data": [ ... ]
}
```

---

## Authentication

Most endpoints require authentication using Bearer Token. Include the token in the Authorization header:

```
Authorization: Bearer {your_token_here}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "status": false,
  "message": "Error message here",
  "errors": { ... }
}
```

Common HTTP Status Codes:
- 200 - Success
- 201 - Created
- 400 - Bad Request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not Found
- 422 - Validation Error
- 429 - Too Many Requests
- 500 - Server Error

---

## Notes

1. All dates should be in YYYY-MM-DD format
2. File uploads should use multipart/form-data
3. Phone numbers should be 10 digits without country code
4. OTP is 4 digits
5. Device tokens are optional but recommended for push notifications
6. Distance calculations are in kilometers
7. All protected endpoints require auth:sanctum middleware

---

*Last Updated:* January 2024  
*API Version:* 1.0


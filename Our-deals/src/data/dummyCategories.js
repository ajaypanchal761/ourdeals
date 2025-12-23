// Import images from assets (using available files)
import images from '../assets/images.jpg'
import download1 from '../assets/download1.jpg'
import download2 from '../assets/download2.jpg'
import download3 from '../assets/download3.jpg'

// Import category images (popular categories)
import weddingRequisitesCategory from '../assets/category1.png'
import beautySpaCategory from '../assets/Beauty & Spa.png'
import foodDiningCategory from '../assets/Food & Dining.png'
import homeServicesCategory from '../assets/Home Services.png'
import hotelsTravelCategory from '../assets/Hotels & Travel.png'
import exploreCityCategory from '../assets/category2.png'

// Use available images for subcategories
const weddingPlans = images
const hotelPg = download1
const foodDining = download2
const beautyCare = download3
const repair = images
const transportationTravel = download1
const dailyServices = download2
const homeServices = download3
const doctor = images
const education = download1
const healthFitness = download2
const rentHire = download3
const securityService = images
const consultant = download1
const contractor = download2
const exploreCities = download3

// Dummy Categories Data with subcategories
export const dummyCategoriesData = [
  {
    categoryName: "Wedding Requisites",
    isPopular: true,
    image: weddingRequisitesCategory,
    subCategories: [
      { name: "Banquet Halls", image: hotelPg },
      { name: "Bridal Requisite", image: weddingPlans },
      { name: "Caterers", image: foodDining },
      { name: "Wedding Planners", image: weddingPlans },
      { name: "Photographers", image: weddingPlans }
    ]
  },
  {
    categoryName: "Beauty & Spa",
    isPopular: true,
    image: beautySpaCategory,
    subCategories: [
      { name: "Beauty Parlours", image: beautyCare },
      { name: "Salons", image: beautyCare },
      { name: "Makeup Artists", image: beautyCare },
      { name: "Mehndi Artists", image: beautyCare },
      { name: "Spa Centers", image: beautyCare }
    ]
  },
  {
    categoryName: "Food & Dining",
    isPopular: true,
    image: foodDiningCategory,
    subCategories: [
      { name: "Restaurants", image: foodDining },
      { name: "Cafes", image: foodDining },
      { name: "Fast Food", image: foodDining },
      { name: "Bakery", image: foodDining },
      { name: "Catering Services", image: foodDining }
    ]
  },
  {
    categoryName: "Home Services",
    isPopular: true,
    image: homeServicesCategory,
    subCategories: [
      { name: "AC Service", image: repair },
      { name: "Car Service", image: repair },
      { name: "Bike Service", image: repair },
      { name: "Plumbing", image: repair },
      { name: "Home Services", image: homeServices }
    ]
  },
  {
    categoryName: "Hotels & Travel",
    isPopular: true,
    image: hotelsTravelCategory,
    subCategories: [
      { name: "Hotels", image: hotelPg },
      { name: "PG Accommodation", image: hotelPg },
      { name: "Travel Agents", image: transportationTravel },
      { name: "Car Rental", image: transportationTravel },
      { name: "Tour Packages", image: transportationTravel }
    ]
  },
  {
    categoryName: "Education",
    isPopular: false,
    image: download1,
    subCategories: [
      { name: "Schools", image: dailyServices },
      { name: "Coaching Centers", image: dailyServices },
      { name: "Tuition Classes", image: dailyServices },
      { name: "Online Courses", image: dailyServices }
    ]
  },
  {
    categoryName: "Healthcare",
    isPopular: false,
    image: download2,
    subCategories: [
      { name: "Hospitals", image: doctor },
      { name: "Clinics", image: doctor },
      { name: "Doctors", image: doctor },
      { name: "Pharmacies", image: doctor },
      { name: "Diagnostic Centers", image: doctor }
    ]
  },
  {
    categoryName: "Real Estate",
    isPopular: false,
    image: download3,
    subCategories: [
      { name: "Property Dealers", image: homeServices },
      { name: "Builders", image: homeServices },
      { name: "Interior Designers", image: homeServices },
      { name: "Architects", image: homeServices }
    ]
  },
  {
    categoryName: "Education & Training",
    isPopular: false,
    image: download1,
    subCategories: [
      { name: "Schools", image: education },
      { name: "Coaching Centers", image: education },
      { name: "Tuition Classes", image: education },
      { name: "Online Courses", image: education },
      { name: "Skill Development", image: education }
    ]
  },
  {
    categoryName: "Fitness & Wellness",
    isPopular: false,
    image: download2,
    subCategories: [
      { name: "Gyms", image: healthFitness },
      { name: "Yoga Centers", image: healthFitness },
      { name: "Fitness Trainers", image: healthFitness },
      { name: "Nutritionists", image: healthFitness }
    ]
  },
  {
    categoryName: "Rent & Hire",
    isPopular: false,
    image: download3,
    subCategories: [
      { name: "Car Rental", image: rentHire },
      { name: "Bike Rental", image: rentHire },
      { name: "Equipment Rental", image: rentHire },
      { name: "Furniture Rental", image: rentHire },
      { name: "Party Equipment", image: rentHire }
    ]
  },
  {
    categoryName: "Security Services",
    isPopular: false,
    image: download1,
    subCategories: [
      { name: "Security Guards", image: securityService },
      { name: "CCTV Installation", image: securityService },
      { name: "Alarm Systems", image: securityService },
      { name: "Security Consulting", image: securityService }
    ]
  },
  {
    categoryName: "Consulting Services",
    isPopular: false,
    image: download2,
    subCategories: [
      { name: "Business Consultants", image: consultant },
      { name: "Legal Consultants", image: consultant },
      { name: "Tax Consultants", image: consultant },
      { name: "Financial Advisors", image: consultant },
      { name: "Career Counselors", image: consultant }
    ]
  },
  {
    categoryName: "Construction & Contractors",
    isPopular: false,
    image: download3,
    subCategories: [
      { name: "Builders", image: contractor },
      { name: "Architects", image: contractor },
      { name: "Civil Engineers", image: contractor },
      { name: "Interior Contractors", image: contractor },
      { name: "Renovation Services", image: contractor }
    ]
  },
  {
    categoryName: "Travel & Tourism",
    isPopular: false,
    image: download1,
    subCategories: [
      { name: "Travel Agents", image: exploreCities },
      { name: "Tour Packages", image: exploreCities },
      { name: "Hotel Booking", image: hotelPg },
      { name: "Travel Guides", image: exploreCities },
      { name: "Adventure Tours", image: exploreCities }
    ]
  },
  {
    categoryName: "Automotive Services",
    isPopular: false,
    image: download2,
    subCategories: [
      { name: "Car Service", image: repair },
      { name: "Bike Service", image: repair },
      { name: "Car Wash", image: repair },
      { name: "Tyre Services", image: repair },
      { name: "Battery Services", image: repair }
    ]
  },
  {
    categoryName: "Home Services",
    isPopular: false,
    image: download3,
    subCategories: [
      { name: "Plumbing", image: homeServices },
      { name: "Electrical Work", image: homeServices },
      { name: "Carpentry", image: homeServices },
      { name: "Painting", image: homeServices },
      { name: "Cleaning Services", image: homeServices }
    ]
  },
  {
    categoryName: "Event Management",
    isPopular: false,
    image: download1,
    subCategories: [
      { name: "Event Planners", image: weddingPlans },
      { name: "Party Organizers", image: weddingPlans },
      { name: "Catering Services", image: foodDining },
      { name: "Decoration Services", image: weddingPlans },
      { name: "Sound & Lighting", image: dailyServices }
    ]
  },
  {
    categoryName: "Pet Services",
    isPopular: false,
    image: download2,
    subCategories: [
      { name: "Pet Shops", image: dailyServices },
      { name: "Veterinary Clinics", image: doctor },
      { name: "Pet Grooming", image: beautyCare },
      { name: "Pet Training", image: dailyServices }
    ]
  },
  {
    categoryName: "Legal Services",
    isPopular: false,
    image: download3,
    subCategories: [
      { name: "Lawyers", image: consultant },
      { name: "Legal Advisors", image: consultant },
      { name: "Notary Services", image: consultant },
      { name: "Documentation", image: consultant }
    ]
  },
  {
    categoryName: "Financial Services",
    isPopular: false,
    image: download1,
    subCategories: [
      { name: "Banks", image: consultant },
      { name: "Insurance Agents", image: consultant },
      { name: "Investment Advisors", image: consultant },
      { name: "Loan Services", image: consultant },
      { name: "Tax Services", image: consultant }
    ]
  },
  {
    categoryName: "Technology Services",
    isPopular: false,
    image: download2,
    subCategories: [
      { name: "Computer Repair", image: repair },
      { name: "Mobile Repair", image: repair },
      { name: "IT Support", image: consultant },
      { name: "Software Development", image: consultant },
      { name: "Web Design", image: consultant }
    ]
  },
  {
    categoryName: "Entertainment",
    isPopular: false,
    image: download3,
    subCategories: [
      { name: "DJ Services", image: dailyServices },
      { name: "Photographers", image: weddingPlans },
      { name: "Videographers", image: weddingPlans },
      { name: "Musicians", image: dailyServices },
      { name: "Entertainment Shows", image: dailyServices }
    ]
  },
  {
    categoryName: "Fashion & Apparel",
    isPopular: false,
    image: download1,
    subCategories: [
      { name: "Boutiques", image: beautyCare },
      { name: "Tailors", image: beautyCare },
      { name: "Jewelry Shops", image: beautyCare },
      { name: "Footwear Stores", image: beautyCare }
    ]
  },
  {
    categoryName: "Grocery & Shopping",
    isPopular: false,
    image: download2,
    subCategories: [
      { name: "Supermarkets", image: foodDining },
      { name: "Grocery Stores", image: foodDining },
      { name: "Online Shopping", image: dailyServices },
      { name: "Department Stores", image: dailyServices }
    ]
  },
  {
    categoryName: "Explore City",
    isPopular: true,
    image: exploreCityCategory,
    subCategories: [
      { name: "Tourist Places", image: download1 },
      { name: "Restaurants", image: download2 },
      { name: "Hotels", image: download3 },
      { name: "Shopping Malls", image: download1 },
      { name: "Entertainment", image: download2 }
    ]
  }
]


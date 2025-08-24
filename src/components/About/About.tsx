import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Award, 
  Users, 
  BookOpen, 
  Globe, 
  Target, 
  Heart,
  Calendar,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const About: React.FC = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const stats = [
    { icon: Users, number: '10,000+', label: 'Students Enrolled' },
    { icon: BookOpen, number: '500+', label: 'Faculty Members' },
    { icon: Award, number: '1,200+', label: 'Courses Offered' },
    { icon: Globe, number: '50+', label: 'Countries Represented' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest standards in education and research, fostering innovation and critical thinking.'
    },
    {
      icon: Heart,
      title: 'Inclusivity',
      description: 'We create a welcoming environment where diverse perspectives are valued and every student can thrive.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We prepare students to address global challenges and make meaningful contributions to society.'
    }
  ];

  const timeline = [
    {
      year: '1985',
      title: 'Foundation',
      description: 'EduSync was established with a vision to revolutionize higher education through technology.'
    },
    {
      year: '1995',
      title: 'Digital Transformation',
      description: 'Pioneered online learning platforms, becoming one of the first institutions to offer digital courses.'
    },
    {
      year: '2005',
      title: 'Global Expansion',
      description: 'Expanded internationally, establishing partnerships with universities across five continents.'
    },
    {
      year: '2015',
      title: 'Innovation Hub',
      description: 'Launched our state-of-the-art research facilities and innovation centers.'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Integrated artificial intelligence to personalize learning experiences for every student.'
    }
  ];

  const facultyHighlights = [
    {
      name: 'Dr. Sarah Johnson',
      title: 'Dean of Computer Science',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      expertise: 'Artificial Intelligence, Machine Learning'
    },
    {
      name: 'Prof. Michael Chen',
      title: 'Head of Engineering',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      expertise: 'Robotics, Automation Systems'
    },
    {
      name: 'Dr. Emily Rodriguez',
      title: 'Director of Research',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      expertise: 'Data Science, Analytics'
    },
    {
      name: 'Prof. David Kim',
      title: 'Department of Mathematics',
      image: 'https://images.pexels.com/photos/2182969/pexels-photo-2182969.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      expertise: 'Applied Mathematics, Statistics'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Us - EduSync</title>
        <meta name="description" content="Learn about EduSync's mission, values, and commitment to transforming education through innovative technology and exceptional faculty." />
        <meta name="keywords" content="about edusync, education, university, faculty, mission, values" />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative bg-blue-600 text-white py-20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About EduSync
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
                Transforming education through innovation, excellence, and a commitment to student success.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section ref={missionRef} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={missionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission & Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                We are dedicated to providing world-class education that empowers students to become leaders, innovators, and positive change-makers in their communities and beyond.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section ref={timelineRef} className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={timelineInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-gray-600">
                Milestones that shaped our institution and defined our commitment to excellence.
              </p>
            </motion.div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
              
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {item.year}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Faculty Highlights */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Faculty
              </h2>
              <p className="text-xl text-gray-600">
                World-class educators and researchers dedicated to student success.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {facultyHighlights.map((faculty, index) => (
                <motion.div
                  key={faculty.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={faculty.image}
                    alt={faculty.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {faculty.name}
                    </h3>
                    <p className="text-blue-600 text-sm mb-2">
                      {faculty.title}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {faculty.expertise}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Visit Our Campus
              </h2>
              <p className="text-xl text-gray-600">
                Experience our state-of-the-art facilities and vibrant campus community.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Campus Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Main Campus</p>
                      <p className="text-gray-600">123 Education Street<br />Learning City, LC 12345</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">info@edusync.edu</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Campus Tours</p>
                      <p className="text-gray-600">Monday - Friday, 9:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gray-100 rounded-lg h-64 flex items-center justify-center"
              >
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Interactive Campus Map</p>
                  <p className="text-sm text-gray-400">Coming Soon</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
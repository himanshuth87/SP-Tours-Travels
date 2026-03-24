/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  MapPin,
  Calendar,
  Car,
  Users,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  Clock,
  ShieldCheck,
  Star,
  Send,
  X,
  Sparkles,
  Menu
} from 'lucide-react';

// --- Types ---
type VehicleType = 'Tempo Traveller' | 'Ertiga';

interface BookingData {
  name: string;
  phone: string;
  pickup: string;
  drop: string;
  date: string;
  vehicle: VehicleType;
  distance: number;
}

// --- Constants ---
const PRICING = {
  'Tempo Traveller': 33,
  'Ertiga': 15,
};

const VEHICLES = [
  {
    id: 'tempo',
    name: 'Tempo Traveller',
    type: 'Tempo Traveller' as VehicleType,
    capacity: '12-17 Seater',
    description: 'Perfect for large groups, pilgrimages, and corporate outings. Spacious interiors with premium pushback seats.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800', // Bus/Van placeholder
    price: 25,
  },
  {
    id: 'ertiga',
    name: 'Maruti Ertiga',
    type: 'Ertiga' as VehicleType,
    capacity: '6+1 Seater',
    description: 'Ideal for family trips and small groups. Compact yet comfortable with excellent fuel efficiency and AC.',
    image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcba80?auto=format&fit=crop&q=80&w=800', // Car placeholder
    price: 15,
  }
];

export default function App() {
  const [booking, setBooking] = useState<BookingData>({
    name: '',
    phone: '',
    pickup: '',
    drop: '',
    date: '',
    vehicle: 'Ertiga',
    distance: 0,
  });

  const [aiInput, setAiInput] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Update price whenever distance or vehicle changes
  useEffect(() => {
    setEstimatedPrice(booking.distance * PRICING[booking.vehicle]);
  }, [booking.distance, booking.vehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBooking(prev => ({
      ...prev,
      [name]: name === 'distance' ? parseFloat(value) || 0 : value
    }));
  };

  const generateWhatsAppLink = (data: BookingData, price: number) => {
    const message = `Hello SP Tours & Travels,
I want to book a ride.

Name: ${data.name}
Phone: ${data.phone}
Vehicle: ${data.vehicle}
Pickup: ${data.pickup}
Drop: ${data.drop}
Date: ${data.date}
Estimated Price: ₹${price}`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/919324419295?text=${encodedMessage}`;
  };

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking.name || !booking.phone || !booking.pickup || !booking.drop || !booking.date) {
      alert('Please fill in all required fields.');
      return;
    }
    window.open(generateWhatsAppLink(booking, estimatedPrice), '_blank');
  };

  // --- Simple AI Assistant Logic ---
  const processAiInput = () => {
    const input = aiInput.toLowerCase();

    // Simple regex/keyword extraction
    const passengersMatch = input.match(/(\d+)\s*(people|person|pax|passengers)/);
    const passengers = passengersMatch ? parseInt(passengersMatch[1]) : 1;

    const dateMatch = input.match(/(tomorrow|today|next week|on \d{1,2}(st|nd|rd|th)? \w+)/);
    const date = dateMatch ? dateMatch[0] : 'Not specified';

    // Extracting locations (very basic: "from X to Y")
    const locationMatch = input.match(/(?:from\s+)?(.+?)\s+to\s+(.+?)(?:\s+|$)/);
    const pickup = locationMatch ? locationMatch[1].trim() : '';
    const drop = locationMatch ? locationMatch[2].trim() : '';

    const suggestedVehicle: VehicleType = passengers > 4 ? 'Tempo Traveller' : 'Ertiga';

    // Mock distance calculation (random between 50-300 for demo)
    const mockDistance = Math.floor(Math.random() * 250) + 50;
    const mockPrice = mockDistance * PRICING[suggestedVehicle];

    const aiBooking: BookingData = {
      name: 'Valued Customer',
      phone: 'Not provided',
      pickup: pickup || 'Mumbai',
      drop: drop || 'Destination',
      date: date,
      vehicle: suggestedVehicle,
      distance: mockDistance
    };

    setBooking(aiBooking);
    setShowAiModal(false);

    // Scroll to booking form
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-saffron selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center glass">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-maroon overflow-hidden bg-white flex items-center justify-center shadow-md">
            <img src="/logo.jpg" alt="SP Tours & Travels" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-navy leading-none">SP Tours & Travels</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-maroon font-bold">Explore India With Us</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-8 text-sm font-medium uppercase tracking-widest text-navy">
          <a href="#vehicles" className="hover:text-saffron transition-colors">Vehicles</a>
          <a href="#booking" className="hover:text-saffron transition-colors">Book Now</a>
          <a href="#why-us" className="hover:text-saffron transition-colors">About</a>
          <a href="#contact" className="hover:text-saffron transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="tel:+919324419295" className="bg-navy text-white px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-maroon transition-all shadow-lg">
            <Phone size={16} />
            <span className="hidden sm:inline">+91 93244 19295</span>
          </a>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-navy"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 top-[80px] bg-white z-[60] flex flex-col p-8 gap-6 shadow-2xl lg:hidden"
            >
              {[
                { name: 'Vehicles', href: '#vehicles' },
                { name: 'Book Now', href: '#booking' },
                { name: 'About Us', href: '#why-us' },
                { name: 'Contact', href: '#contact' },
              ].map((link, i) => (
                <motion.a 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-display font-bold text-navy hover:text-saffron border-b border-slate-100 pb-4"
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="mt-8">
                <p className="text-slate-400 text-sm uppercase tracking-widest mb-4">Contact us instantly</p>
                <a href="https://wa.me/919324419295" className="flex items-center gap-3 text-indian-green font-bold text-lg">
                   <Phone size={20} /> +91 93244 19295
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=2000"
            alt="Indian Road Trip"
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-cream/20"></div>
        </div>




      </section>

      {/* Vehicle Showcase */}
      <section id="vehicles" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mb-4">Our Premium Fleet</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Choose from our well-maintained vehicles designed for maximum comfort and safety on Indian roads.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {VEHICLES.map((v) => (
            <motion.div
              key={v.id}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={v.image}
                  alt={v.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-navy mb-1">{v.name}</h3>
                    <div className="flex items-center gap-2 text-saffron font-semibold">
                      <Users size={18} />
                      <span>{v.capacity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-navy">₹{v.price}</div>
                    <div className="text-xs text-slate-400 uppercase font-bold">Per KM</div>
                  </div>
                </div>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  {v.description}
                </p>
                <a
                  href="#booking"
                  onClick={() => setBooking(prev => ({ ...prev, vehicle: v.type }))}
                  className="w-full py-4 rounded-xl border-2 border-navy text-navy font-bold hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Select This Vehicle
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-24 bg-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon/20 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">Why Travel With Us?</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { icon: <ShieldCheck className="text-saffron" />, title: 'Safe & Secure', desc: 'GPS tracked vehicles and verified professional drivers.' },
                  { icon: <CheckCircle2 className="text-saffron" />, title: 'Affordable Pricing', desc: 'Transparent billing with no hidden charges. Best rates in Mumbai.' },
                  { icon: <Clock className="text-saffron" />, title: '24/7 Availability', desc: 'Ready to serve you anytime, anywhere for your travel needs.' },
                  { icon: <Star className="text-saffron" />, title: 'Premium Comfort', desc: 'Clean, sanitized vehicles with high-end amenities.' },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-bold">{item.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3">
                <img
                  src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1000"
                  alt="India Travel"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl text-navy max-w-[200px] -rotate-3">
                <div className="text-3xl font-bold mb-1">100%</div>
                <div className="text-sm font-semibold">Customer Satisfaction Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form & Calculator */}
      <section id="booking" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
            {/* Form Side */}
            <div className="flex-1 p-8 md:p-12">
              <div className="mb-10">
                <h2 className="font-display text-3xl font-bold text-navy mb-2">Book Your Ride</h2>
                <p className="text-slate-500">Fill in the details and we'll get back to you instantly.</p>
              </div>

              <form onSubmit={handleBookNow} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={booking.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={booking.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Pickup Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indian-green" size={18} />
                      <input
                        type="text"
                        name="pickup"
                        value={booking.pickup}
                        onChange={handleInputChange}
                        placeholder="e.g. Kurla East"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Drop Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" size={18} />
                      <input
                        type="text"
                        name="drop"
                        value={booking.drop}
                        onChange={handleInputChange}
                        placeholder="e.g. Lonavala"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Travel Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="date"
                        name="date"
                        value={booking.date}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Vehicle Type</label>
                    <div className="relative">
                      <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        name="vehicle"
                        value={booking.vehicle}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all appearance-none"
                      >
                        <option value="Ertiga">Maruti Ertiga (₹15/km)</option>
                        <option value="Tempo Traveller">Tempo Traveller (₹25/km)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Estimated Distance (KM)</label>
                  <input
                    type="number"
                    name="distance"
                    value={booking.distance || ''}
                    onChange={handleInputChange}
                    placeholder="Enter distance in KM"
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-navy text-white py-5 rounded-2xl font-bold text-lg hover:bg-maroon transition-all shadow-xl flex items-center justify-center gap-3 group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                  Book via WhatsApp
                </button>
              </form>
            </div>

            {/* Price Side */}
            <div className="w-full md:w-80 bg-navy p-8 md:p-12 text-white flex flex-col justify-center text-center">
              <div className="mb-8">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={32} className="text-saffron" />
                </div>
                <h3 className="text-xl font-bold mb-2">Estimated Price</h3>
                <p className="text-white/60 text-sm">Based on {booking.distance} KM travel</p>
              </div>

              <div className="text-5xl font-bold mb-2">
                ₹{estimatedPrice.toLocaleString()}
              </div>
              <div className="text-saffron font-semibold uppercase tracking-widest text-xs mb-8">
                All Inclusive*
              </div>

              <div className="space-y-4 text-left border-t border-white/10 pt-8">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-saffron" />
                  <span>Professional Driver</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-saffron" />
                  <span>Clean & Sanitized</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-saffron" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-display text-4xl font-bold text-navy mb-8">Get In Touch</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0">
                    <MapPin className="text-saffron" size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-navy mb-1">Our Office</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Eastern Winds, Kurla East,<br />
                      Mumbai, Maharashtra 400024, India
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0">
                    <Phone className="text-saffron" size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-navy mb-1">Phone Number</h4>
                    <p className="text-slate-600 mb-2">+91 93244 19295</p>
                    <a href="tel:+919324419295" className="text-navy font-bold hover:underline">Call Us Now</a>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0">
                    <MessageSquare className="text-saffron" size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-navy mb-1">WhatsApp</h4>
                    <p className="text-slate-600 mb-2">Chat with us for instant quotes</p>
                    <a href="https://wa.me/919324419295" className="text-navy font-bold hover:underline">Start Chat</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl h-[400px] bg-slate-200 relative">
              {/* Mock Map Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center flex-col text-slate-400">
                <MapPin size={48} className="text-maroon mb-4" />
                <span className="font-bold">Kurla East, Mumbai</span>
                <span className="text-sm">Map View (Interactive)</span>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.887143436402!2d72.8804!3d19.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzM2LjAiTiA3MsKwNTInNDkuNCJF!5e0!3m2!1sen!2sin!4v1630000000000!5m2!1sen!2sin"
                className="w-full h-full border-0 grayscale opacity-80"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-maroon flex items-center justify-center">
                  <img src="/logo.jpg" alt="SP logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-display text-2xl font-bold">SP Tours & Travels</span>
              </div>
              <p className="text-white/60 italic">"Desi Rides, Premium Experience"</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-saffron transition-colors">
                <Star size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-saffron transition-colors">
                <MessageSquare size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-saffron transition-colors">
                <Phone size={20} />
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© 2026 SP Tours & Travels. All Rights Reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant Modal */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="bg-navy p-8 text-white relative">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-saffron rounded-xl flex items-center justify-center">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">AI Travel Assistant</h3>
                </div>
                <p className="text-white/70 text-sm">Tell me where you want to go, when, and with how many people. I'll handle the rest!</p>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Your Request</label>
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="e.g. Kurla to Lonavala tomorrow 5 people"
                    className="w-full h-32 px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-saffron focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
                <button
                  onClick={processAiInput}
                  className="w-full bg-saffron text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <Send size={20} /> Plan My Trip
                </button>
                <div className="text-center text-xs text-slate-400 italic">
                  "I can suggest vehicles and estimate prices based on your input."
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919324419295" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-40"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
      </a>
    </div>
  );
}

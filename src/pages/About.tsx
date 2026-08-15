import { Link } from 'react-router'
import { dataService } from '../data/dataService'
import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'

const stats = [
  { value: '1,239+', label: 'Participants' },
  { value: '25+', label: 'Training Events' },
  { value: '15+', label: 'Expert Instructors' },
  { value: '1,000+', label: 'Certificates Issued' },
]

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2F2454] to-[#5b3d9e] px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
            <div className="text-white text-left">
              <p className="font-bold text-xl">Prestigium Academia</p>
              <p className="text-white/60 text-sm">Engineering Education Platform</p>
            </div>
          </div>
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-5 leading-tight">Empowering Technical Knowledge</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Prestigium Academia is an engineering education and professional training platform built to bridge the gap between academic knowledge and real-world engineering practice.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#F2EFFD] py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-[#2F2454] text-4xl font-bold">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-[#2F2454] rounded-3xl p-8 text-white">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl mb-5">🎯</div>
            <h2 className="font-bold text-2xl mb-4">Our Mission</h2>
            <p className="text-white/75 leading-relaxed">
              To democratize access to high-quality engineering education by delivering practical, industry-aligned training programs that equip engineers with the skills, knowledge, and credentials needed to excel in their careers — regardless of their starting point.
            </p>
          </div>
          <div className="bg-[#F2EFFD] rounded-3xl p-8">
            <div className="w-12 h-12 rounded-2xl bg-[#DBCDFD] flex items-center justify-center text-2xl mb-5">🔭</div>
            <h2 className="font-bold text-2xl text-[#2F2454] mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the leading engineering professional development platform in Southeast Asia — recognized for the quality of our instructors, the rigor of our programs, and the career impact we create for every participant who passes through our training.
            </p>
          </div>
        </div>

        {/* Our Approach */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <p className="text-[#A577D5] font-semibold text-sm mb-2 uppercase tracking-wide">Methodology</p>
            <h2 className="text-[#2F2454] text-3xl font-bold">Our Training Approach</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🏭', title: 'Industry-Led Design', desc: 'Every program is developed in collaboration with active engineering professionals who bring current, real-world relevance to the curriculum.' },
              { icon: '🛠', title: 'Hands-On Application', desc: 'We prioritize practical application over passive learning. Every training includes case studies, exercises, and real project scenarios.' },
              { icon: '📜', title: 'Verified Certification', desc: 'Our certificates are digitally signed, uniquely identified, and publicly verifiable — giving participants credentials that carry genuine professional weight.' },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#2F2454] text-base mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Learn With Us */}
        <div className="bg-gradient-to-br from-[#F2EFFD] to-[#DBCDFD] rounded-3xl p-10 mb-20">
          <div className="text-center mb-10">
            <h2 className="text-[#2F2454] text-3xl font-bold">Why Learn With Prestigium?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Industry Expertise', desc: 'Instructors with 10–25 years of hands-on project experience' },
              { title: 'Small Cohorts', desc: 'Intentionally limited seats for focused, personalized learning' },
              { title: 'Practical Focus', desc: 'Every session uses real case studies from Indonesian engineering projects' },
              { title: 'Career Impact', desc: 'Alumni report measurable career advancement within 12 months' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5">
                <h3 className="font-bold text-[#2F2454] text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instructors */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <p className="text-[#A577D5] font-semibold text-sm mb-2 uppercase tracking-wide">The Team</p>
            <h2 className="text-[#2F2454] text-3xl font-bold">Professional Instructors</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructors.map((ins) => (
              <div key={ins.id} className="bg-white border border-gray-100 rounded-2xl p-5 text-center shadow-sm hover:shadow-lg transition-all group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4">
                  <img src={ins.image} alt={ins.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <p className="font-bold text-[#2F2454] text-sm">{ins.name}</p>
                <p className="text-[#A577D5] text-xs font-medium mt-0.5">{ins.title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{ins.company}</p>
                <span className="inline-block mt-3 bg-[#F2EFFD] text-[#2F2454] text-[10px] font-semibold px-2.5 py-1 rounded-full">{ins.experience}</span>
                <p className="text-gray-500 text-xs mt-3 leading-relaxed line-clamp-3">{ins.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Training Philosophy */}
        <div className="bg-[#2F2454] rounded-3xl p-10 text-center text-white mb-12">
          <h2 className="text-2xl font-bold mb-4">Training Philosophy</h2>
          <p className="text-white/75 max-w-2xl mx-auto leading-relaxed text-base">
            We believe that engineering education should be as close to practice as possible. That means hiring instructors who are still actively working in the industry, designing exercises around real project scenarios, and issuing credentials that reflect genuine competency — not just course completion.
          </p>
        </div>

        <div className="text-center">
          <Link to="/training" className="inline-block bg-[#2F2454] text-white font-bold px-10 py-4 rounded-full hover:bg-[#A577D5] transition-all text-base shadow-lg">
            Explore Our Training
          </Link>
        </div>
      </div>
    </div>
  )
}

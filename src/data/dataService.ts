import { supabase } from '../lib/supabaseClient'
import type { Training } from './mockData'

export const dataService = {
  // Trainings
  async getTrainings() {
    const { data, error } = await supabase
      .from('pa_trainings')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getTrainingById(id: string) {
    const { data, error } = await supabase
      .from('pa_trainings')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async createTraining(training: Partial<any>) {
    const { data, error } = await supabase
      .from('pa_trainings')
      .insert([training])
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Registrations
  async getRegistrations(userId?: string) {
    let query = supabase
      .from('pa_registrations')
      .select(`
        *,
        pa_trainings (*)
      `)
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async createRegistration(registration: { user_id: string; training_id: string; status?: string }) {
    // We should ideally use an RPC for atomic seat deduction,
    // but for now let's do simple insert.
    const { data, error } = await supabase
      .from('pa_registrations')
      .insert([registration])
      .select()
      .single()
    if (error) throw error

    // Deduct seat
    await supabase.rpc('pa_deduct_seat', { t_id: registration.training_id })

    return data
  },

  async updateRegistration(id: string, updates: any) {
    const { data, error } = await supabase
      .from('pa_registrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Articles
  async getArticles() {
    const { data, error } = await supabase
      .from('pa_articles')
      .select('*')
      .order('published_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getArticleById(id: string) {
    const { data, error } = await supabase
      .from('pa_articles')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  // Gallery
  async getGallery() {
    const { data, error } = await supabase
      .from('pa_gallery')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  // Certificates
  async getCertificates(userId?: string) {
    let query = supabase
      .from('pa_certificates')
      .select(`
        *,
        pa_trainings (*),
        pa_profiles (*)
      `)
      .order('issued_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async verifyCertificate(certId: string) {
    const { data, error } = await supabase
      .from('pa_certificates')
      .select(`
        *,
        pa_trainings (*),
        pa_profiles (*)
      `)
      .eq('id', certId)
      .single()
    if (error) throw error
    return data
  },

  // Profiles
  async getProfiles() {
    const { data, error } = await supabase
      .from('pa_profiles')
      .select('*')
      .order('full_name', { ascending: true })
    if (error) throw error
    return data
  },

  // Articles CRUD
  async createArticle(article: any) {
    const { data, error } = await supabase
      .from('pa_articles')
      .insert([article])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteArticle(id: string) {
    const { error } = await supabase
      .from('pa_articles')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Gallery CRUD
  async createGalleryItem(item: any) {
    const { data, error } = await supabase
      .from('pa_gallery')
      .insert([item])
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteGalleryItem(id: string) {
    const { error } = await supabase
      .from('pa_gallery')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Training CRUD
  async deleteTraining(id: string) {
    const { error } = await supabase
      .from('pa_trainings')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async updateTraining(id: string, updates: any) {
    const { data, error } = await supabase
      .from('pa_trainings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // Certificate Issuance
  async issueCertificate(cert: { id: string; registration_id: string; user_id: string; training_id: string }) {
    const { data: certData, error: certError } = await supabase
      .from('pa_certificates')
      .insert([cert])
      .select()
      .single()
    if (certError) throw certError

    // Update registration status to Completed
    await this.updateRegistration(cert.registration_id, { status: 'Completed' })

    return certData
  },

  // Stats for Homepage
  async getSummaryStats() {
    const [profiles, trainings, certs] = await Promise.all([
      supabase.from('pa_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('pa_trainings').select('*', { count: 'exact', head: true }),
      supabase.from('pa_certificates').select('*', { count: 'exact', head: true })
    ])

    // For instructors, let's count unique instructors from trainings
    const { data: instructors } = await supabase.from('pa_trainings').select('instructor')
    const uniqueInstructors = new Set(instructors?.map(i => i.instructor)).size

    return {
      participants: profiles.count || 0,
      events: trainings.count || 0,
      certificates: certs.count || 0,
      instructors: uniqueInstructors || 0
    }
  }
}

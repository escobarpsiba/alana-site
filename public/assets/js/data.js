const FALLBACK_IMG = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
const SUPABASE_URL = 'https://ktjbdpabrljpuhqxbgti.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mtp7X8D-YLJN7Zjen3umeA_PM-CcVLE'

const _h = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
}

async function _get(url) {
  const r = await fetch(url, { headers: _h })
  return r.json()
}
async function _post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: _h, body: JSON.stringify(body) })
  return r.json()
}
async function _patch(url, body) {
  const r = await fetch(url, { method: 'PATCH', headers: _h, body: JSON.stringify(body) })
  return r.json()
}
async function _delete(url) {
  const r = await fetch(url, { method: 'DELETE', headers: _h })
  return r.json()
}

const DB = {
  async getPosts() {
    const p = await _get(`${SUPABASE_URL}/rest/v1/posts?select=*&order=date.desc`)
    return p.map(x => ({ ...x, image: x.image || FALLBACK_IMG }))
  },
  async getPost(slug) {
    const p = await _get(`${SUPABASE_URL}/rest/v1/posts?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`)
    const post = p[0] || null
    if (post) post.image = post.image || FALLBACK_IMG
    return post
  },
  async createPost(data) {
    const slug = data.slug || data.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const post = { slug, title: data.title, tag: data.tag, category: data.category || 'geral', image: data.image || '', excerpt: data.excerpt, content: data.content, date: new Date().toISOString().split('T')[0] }
    return _post(`${SUPABASE_URL}/rest/v1/posts`, post)
  },
  async updatePost(slug, data) {
    return _patch(`${SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}`, data)
  },
  async deletePost(slug) {
    return _delete(`${SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}`)
  },

  async getCategories() {
    const c = await _get(`${SUPABASE_URL}/rest/v1/categories?select=name&order=name.asc`)
    return c.map(x => x.name)
  },
  async createCategory(name) {
    return _post(`${SUPABASE_URL}/rest/v1/categories`, { name })
  },
  async renameCategory(oldName, newName) {
    await _post(`${SUPABASE_URL}/rest/v1/categories`, { name: newName })
    const posts = await this.getPosts()
    for (const p of posts) {
      if (p.tag === oldName) await _patch(`${SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(p.slug)}`, { tag: newName })
    }
  },
  async deleteCategory(name) {
    return _delete(`${SUPABASE_URL}/rest/v1/categories?name=eq.${encodeURIComponent(name)}`)
  },

  async getComments() {
    return _get(`${SUPABASE_URL}/rest/v1/comments?select=*&order=date.desc`)
  },
  async getApprovedComments(postSlug) {
    return _get(`${SUPABASE_URL}/rest/v1/comments?select=*&post_slug=eq.${encodeURIComponent(postSlug)}&approved=eq.true&order=date.desc`)
  },
  async addComment(data) {
    return _post(`${SUPABASE_URL}/rest/v1/comments`, {
      post_slug: data.postSlug, post_title: data.postTitle,
      author: data.author, content: data.content,
      date: new Date().toISOString().split('T')[0], approved: false
    })
  },
  async toggleApproveComment(id) {
    const all = await this.getComments()
    const c = all.find(x => x.id === id)
    if (!c) return
    return _patch(`${SUPABASE_URL}/rest/v1/comments?id=eq.${id}`, { approved: !c.approved })
  },
  async deleteComment(id) {
    return _delete(`${SUPABASE_URL}/rest/v1/comments?id=eq.${id}`)
  },

  async getMedia() {
    return _get(`${SUPABASE_URL}/rest/v1/media?select=*&order=date.desc`)
  },
  async uploadMedia(file) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `uploads/${Date.now()}-${safeName}`
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/media/${path}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': file.type
      },
      body: file
    })
    if (!res.ok) {
      const body = await res.text()
      let msg = body
      try { const j = JSON.parse(body); msg = j.message || j.error || body } catch {}
      throw new Error('Falha no upload: ' + msg.slice(0, 200))
    }
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/media/${path}`
    await _post(`${SUPABASE_URL}/rest/v1/media`, {
      name: file.name, data_url: publicUrl,
      type: file.type, size: file.size
    })
  },
  async deleteMedia(id) {
    return _delete(`${SUPABASE_URL}/rest/v1/media?id=eq.${id}`)
  },

  async getSettings() {
    const s = await _get(`${SUPABASE_URL}/rest/v1/settings?select=value&key=eq.site_config&limit=1`)
    return s[0]?.value || { siteTitle: 'Alana Piranji | Psicanalista', siteDescription: '', keywords: '', email: '', city: '', socialLinks: [] }
  },
  async _saveSettings(val) {
    const existing = await _get(`${SUPABASE_URL}/rest/v1/settings?select=id&key=eq.site_config&limit=1`)
    if (existing[0]) {
      return _patch(`${SUPABASE_URL}/rest/v1/settings?id=eq.${existing[0].id}`, { value: val })
    }
    return _post(`${SUPABASE_URL}/rest/v1/settings`, { key: 'site_config', value: val })
  },
  async updateSettings(data) {
    const s = await this.getSettings()
    return this._saveSettings({ ...s, ...data })
  },
  async addSocialLink(platform, url) {
    const s = await this.getSettings()
    const links = [...(s.socialLinks || []), { id: Date.now().toString(36), platform, url }]
    return this._saveSettings({ ...s, socialLinks: links })
  },
  async removeSocialLink(id) {
    const s = await this.getSettings()
    const links = (s.socialLinks || []).filter(l => l.id !== id)
    return this._saveSettings({ ...s, socialLinks: links })
  },

  async init() {
    const c = await _get(`${SUPABASE_URL}/rest/v1/categories?select=name&limit=1`)
    if (c.length === 0) {
      for (const cat of ['Teoria Lacaniana', 'Clínica', 'Cultura', 'Sonhos', 'Sintoma', 'Desejo']) {
        await _post(`${SUPABASE_URL}/rest/v1/categories`, { name: cat })
      }
      const s = await _get(`${SUPABASE_URL}/rest/v1/settings?select=id&key=eq.site_config&limit=1`)
      if (s.length === 0) {
        await _post(`${SUPABASE_URL}/rest/v1/settings`, {
          key: 'site_config',
          value: { siteTitle: 'Alana Piranji | Psicanalista', siteDescription: 'Psicanálise de orientação lacaniana — o inconsciente estruturado como linguagem, o desejo como ética.', keywords: 'psicanálise, lacan, freud, psicanalista, inconsciente', email: 'contato@alanapiranji.com.br', city: 'Taguatinga - Brasília - DF', socialLinks: [] }
        })
      }
      const p = await _get(`${SUPABASE_URL}/rest/v1/posts?select=id&limit=1`)
      if (p.length === 0) {
        for (const post of [
          { slug: 'o-inconsciente-estruturado', title: 'O Inconsciente Estruturado como Linguagem', tag: 'Teoria Lacaniana', category: 'teoria', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80', excerpt: 'Uma introdução ao conceito fundamental de Jacques Lacan: o inconsciente não é um reservatório de instintos, mas um saber que se articula como uma linguagem.', content: '<p>Lacan parte do ensino de Saussure para propor que o inconsciente é estruturado como uma linguagem. Isso significa que os processos inconscientes — condensação e deslocamento — são equivalentes à metáfora e à metonímia.</p><p>O sintoma, o sonho, o ato falho e o chiste são formações do inconsciente que obedecem a uma lógica significante. Cabe ao analista escutar, não o sentido oculto, mas a cadeia de significantes que se repete na fala do analisando.</p>' },
          { slug: 'desejo-e-falta', title: 'Desejo e Falta: A Ética Lacaniana', tag: 'Teoria Lacaniana', category: 'teoria', image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80', excerpt: 'O desejo não é a busca por um objeto, mas aquilo que se sustenta na falta. Uma reflexão sobre a ética do desejo na psicanálise.', content: '<p>Para Lacan, o desejo é o desejo do Outro. Não se trata de um desejo que já nos pertenceria, mas de um desejo constituído na linguagem e na relação com o Outro.</p><p>A falta-a-ser (manque-à-être) é estrutural: o sujeito é marcado por uma perda fundamental que o constitui como desejante. A psicanálise não promete preencher essa falta, mas ensinar o sujeito a desejar apesar dela — ou através dela.</p>' },
          { slug: 'o-sinthoma', title: 'Do Sintoma ao Sinthoma', tag: 'Clínica', category: 'clinica', image: 'https://images.unsplash.com/photo-1493836512294-46a9d6985c0a?w=800&q=80', excerpt: 'O percurso do sintoma na obra de Lacan: de formação do inconsciente a invenção singular que amarra os três registros.', content: '<p>No início de seu ensino, Lacan define o sintoma como uma formação do inconsciente — uma metáfora que retorna como mensagem a ser decifrada.</p><p>Ao final de sua obra, o sintoma torna-se sinthoma: uma invenção singular que amarra os registros Real, Simbólico e Imaginário. Não se trata mais de decifrar, mas de identificar-se com o sintoma — fazer dele um modo de gozo que sustenta a vida.</p>' }
        ]) {
          await _post(`${SUPABASE_URL}/rest/v1/posts`, { ...post, date: '2026-06-10' })
        }
      }
    }
  }
}

DB.init()

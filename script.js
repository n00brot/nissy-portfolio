let currentStyle = 'minimal'
let currentPalette = 'blue'

const palettes = {
  blue:  { accent: '#2563eb', bg: '#eff6ff', text: '#1e3a8a', cta: '#2563eb', ctaText: '#fff' },
  green: { accent: '#16a34a', bg: '#f0fdf4', text: '#14532d', cta: '#16a34a', ctaText: '#fff' },
  rose:  { accent: '#e11d48', bg: '#fff1f2', text: '#881337', cta: '#e11d48', ctaText: '#fff' },
  amber: { accent: '#d97706', bg: '#fffbeb', text: '#78350f', cta: '#d97706', ctaText: '#fff' },
}

const styles = {
  minimal: { font: 'system-ui, sans-serif', weight: '400', titleSize: '1.6rem', radius: '8px' },
  bold:    { font: 'system-ui, sans-serif', weight: '800', titleSize: '2rem',   radius: '4px' },
  elegant: { font: 'Georgia, serif',        weight: '400', titleSize: '1.7rem', radius: '16px' },
}

function updatePreview() {
  const p = palettes[currentPalette]
  const s = styles[currentStyle]
  const box = document.getElementById('preview-inner')
  const title = document.getElementById('preview-title')
  const sub = document.getElementById('preview-sub')
  const cta = document.getElementById('preview-cta')

  box.style.background = p.bg
  box.style.fontFamily = s.font
  box.style.borderRadius = s.radius

  title.style.color = p.text
  title.style.fontSize = s.titleSize
  title.style.fontWeight = s.weight

  sub.style.color = p.accent

  cta.style.background = p.cta
  cta.style.color = p.ctaText
  cta.style.borderRadius = s.radius

  document.documentElement.style.setProperty('--accent', p.accent)
  document.documentElement.style.setProperty('--accent-light', p.bg)
}

function setStyle(style) {
  currentStyle = style
  document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'))
  document.querySelector(`.style-btn[onclick="setStyle('${style}')"]`).classList.add('active')
  updatePreview()
}

function setPalette(palette) {
  currentPalette = palette
  document.querySelectorAll('.palette-btn').forEach(b => b.classList.remove('active'))
  document.querySelector(`.palette-btn[data-palette="${palette}"]`).classList.add('active')
  updatePreview()
}

function filterWork(type) {
  document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'))
  event.target.classList.add('active')
  document.querySelectorAll('.work-card').forEach(card => {
    card.classList.toggle('hidden', type !== 'all' && card.dataset.type !== type)
  })
}

function sendVibe() {
  const styleField = document.getElementById('f-style')
  styleField.value = `Style: ${currentStyle} — Palette: ${currentPalette}`
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })
}

async function submitForm() {
    const name = document.getElementById('f-name').value.trim()
    const business = document.getElementById('f-business').value.trim()
    const email = document.getElementById('f-email').value.trim()
    const message = document.getElementById('f-message').value.trim()
    const style = document.getElementById('f-style').value
    const note = document.getElementById('form-note')
    const btn = document.querySelector('.contact .btn-primary')
  
    if (!name || !email) {
      note.textContent = 'please fill in your name and email.'
      note.style.color = '#e11d48'
      return
    }
  
    btn.textContent = 'sending...'
    btn.disabled = true
  
    try {
      const res = await fetch('https://formspree.io/f/mjglrjye', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, business, email, message, style })
      })
  
      if (res.ok) {
        note.textContent = "message sent — i'll be in touch within 24 hours."
        note.style.color = '#16a34a'
        btn.textContent = 'sent'
        document.querySelectorAll('.form-wrap input, .form-wrap textarea').forEach(el => el.value = '')
      } else {
        throw new Error()
      }
    } catch {
      note.textContent = 'something went wrong — email me directly at hello@nissy.dev'
      note.style.color = '#e11d48'
      btn.textContent = 'send message'
      btn.disabled = false
    }
  }
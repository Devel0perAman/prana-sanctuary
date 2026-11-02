import { PageHero } from '../components/ui.jsx'
import { Link } from '../lib/router.jsx'
import { SITE } from '../data/site.js'
import { usePageMeta } from '../lib/hooks.js'

const PAGES = {
  privacy: { title: 'Privacy Policy', blocks: [
    ['What we collect', 'When you contact us, enrol in a course or subscribe to our newsletter we collect your name, email address, phone number and the message you send. Payment details (card, UPI, netbanking) are entered directly into Razorpay\'s secure window — they never reach or get stored on our servers.'],
    ['How we use it', 'To reply to your enquiry, deliver the courses you purchase, send receipts and — only if you opted in — our newsletter. We do not sell your information.'],
    ['Sharing', 'We share data only with service providers needed to run the site (payment processing by Razorpay, email delivery, hosting) and when required by law.'],
    ['Your choices', `You may request access, correction or deletion of your data at any time by emailing ${SITE.email}. You can unsubscribe from the newsletter at any moment.`],
    ['Cookies', 'We use only essential browser storage needed for the site to work. We do not run third-party advertising trackers.'],
  ] },
  terms: { title: 'Terms of Service', blocks: [
    ['Using the site', 'Content on this website is for personal, non-commercial use. Yoga involves physical movement; please consult a healthcare professional before beginning, and practise within your limits.'],
    ['Courses & memberships', 'Purchasing a course or membership gives you a personal, non-transferable licence to view it for the period stated. Sharing login details or redistributing recordings is not permitted.'],
    ['Pricing & payment', 'All prices are shown in Indian Rupees (INR) and include applicable taxes unless stated. Payments are processed securely by Razorpay.'],
    ['Liability', 'Classes and courses are educational and not a substitute for medical advice. To the extent permitted by law, PRĀNA Sanctuary is not liable for injury or loss arising from your practice.'],
  ] },
  refunds: { title: 'Refund & Cancellation Policy', blocks: [
    ['Online courses', 'If a course is not right for you, write to us within 7 days of purchase with less than 25% of the course viewed and we will refund your payment in full.'],
    ['Memberships', 'Memberships are paid for the period selected and do not auto-renew. You may request a pause (up to 90 days) before your period ends.'],
    ['Teacher training', 'Deposits are refundable up to 30 days before a cohort starts, less a 10% administration fee. Please see your enrolment agreement for instalment terms.'],
    ['How refunds are paid', 'Approved refunds are returned to the original payment method via Razorpay and typically appear within 5–7 working days.'],
  ] },
}

export default function Legal({ page }) {
  const p = PAGES[page]
  usePageMeta(p.title)
  return (
    <main id="main">
      <PageHero title={p.title} text={`Last updated ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`} />
      <div className="wrap wrap--narrow legal sec sec--tight">
        {p.blocks.map(([h, t]) => <section key={h}><h2 className="h4">{h}</h2><p>{t}</p></section>)}
        <p className="muted">Questions? <Link to="/contact" className="text-link">Contact us</Link> or write to {SITE.email}. These are starter policies — have them reviewed by a legal professional before launch.</p>
      </div>
    </main>
  )
}

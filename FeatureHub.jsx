import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock3, FileText, Search } from 'lucide-react';
import AuthenticatedLayout from '../components/AuthenticatedLayout.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Card from '../components/Card.jsx';
import './FeatureHub.css';

const LOANS = {
  'loan-details': { title: 'Loan Details', subtitle: 'Review your loan accounts, balances and repayment status.', description: 'View your active loan summary and key details.', action: 'Refresh loan details' },
  'loan-repayment': { title: 'Loan Repayment', subtitle: 'Estimate your instalment and record a demo repayment.', description: 'Calculate an estimated monthly instalment before proceeding.', action: 'Calculate repayment' },
  'instant-overdraft': { title: 'Instant Overdraft', subtitle: 'Explore an overdraft limit linked to your eligible account.', description: 'Check a sample overdraft eligibility estimate.', action: 'Check eligibility' },
  'gold-od-loan': { title: 'Gold OD Loan', subtitle: 'Explore an overdraft facility secured against eligible gold.', description: 'Enter an estimated gold value to view a sample limit.', action: 'Estimate gold OD' },
  'account-statement': { title: 'Account Statement', subtitle: 'Find and export your loan-related account activity.', description: 'Filter sample statement entries by date range.', action: 'Apply filters' },
  'loan-against-mutual-funds': { title: 'Loan Against Mutual Funds', subtitle: 'Estimate borrowing against eligible mutual fund holdings.', description: 'Enter your portfolio value to estimate a sample loan limit.', action: 'Estimate loan limit' },
  'actual-interest-collected': { title: 'Actual Interest Collected', subtitle: 'Review a sample breakdown of interest collected.', description: 'See an illustrative interest summary for your account.', action: 'View interest summary' },
};
const LIFESTYLE = {
  healthcare: { title: 'Healthcare', subtitle: 'Explore healthcare payments and services.', description: 'Enter a provider or service to prepare a demo payment request.', action: 'Continue' },
  'train-tickets': { title: 'Train Tickets', subtitle: 'Plan a rail journey.', description: 'Search a sample journey by origin, destination and travel date.', action: 'Search trains' },
  flights: { title: 'Flights', subtitle: 'Plan your next flight.', description: 'Search a sample flight by origin, destination and travel date.', action: 'Search flights' },
  'free-credit-score': { title: 'Free Credit Score', subtitle: 'Understand your credit profile.', description: 'Request a demo credit-score overview. No credit bureau is contacted.', action: 'View sample score' },
  shopping: { title: 'Shopping', subtitle: 'Browse shopping offers and payment options.', description: 'Search the demo catalogue for shopping offers.', action: 'Search offers' },
  'e-gift-card': { title: 'E-Gift Card', subtitle: 'Prepare a digital gift card order.', description: 'Choose a value and recipient for a demo gift card.', action: 'Preview gift card' },
  bus: { title: 'Bus', subtitle: 'Plan an intercity bus journey.', description: 'Search a sample bus journey by origin, destination and travel date.', action: 'Search buses' },
};
const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function FeatureHub({ section: sectionProp }) {
  const params = useParams();
  const section = sectionProp || params.section;
  const { feature } = params;
  const item = (section === 'loans' ? LOANS : LIFESTYLE)[feature];
  const [amount, setAmount] = useState('500000');
  const [rate, setRate] = useState('10.5');
  const [tenure, setTenure] = useState('36');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [query, setQuery] = useState('');
  const [recipient, setRecipient] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const isLoan = section === 'loans';
  const emi = useMemo(() => { const p = Number(amount), r = Number(rate) / 1200, n = Number(tenure); return r && n ? p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : (n ? p / n : 0); }, [amount, rate, tenure]);
  if (!item) return <AuthenticatedLayout><div className="page-fade feature-hub"><PageHeader title="Feature not found" /><Card><p>This feature could not be found.</p><Link className="btn-link" to="/dashboard">Return to dashboard</Link></Card></div></AuthenticatedLayout>;

  function submit(e) {
    e.preventDefault();
    let message = 'Your request has been prepared in demo mode.';
    if (feature === 'loan-repayment') message = `Estimated EMI: ${money(emi)} per month for ${tenure} months. This is an estimate, not a loan offer.`;
    else if (feature === 'instant-overdraft') message = `Illustrative overdraft limit: ${money(Number(amount) * 0.4)} (40% sample estimate). Final eligibility requires bank assessment.`;
    else if (feature === 'gold-od-loan') message = `Illustrative gold OD limit: ${money(Number(amount) * 0.75)} (75% sample estimate). Valuation and approval are required.`;
    else if (feature === 'loan-against-mutual-funds') message = `Illustrative loan limit: ${money(Number(amount) * 0.5)} (50% sample estimate). Eligible holdings and lender terms apply.`;
    else if (feature === 'free-credit-score') message = 'Sample credit profile: 752 / Good. This is illustrative data, not a real credit-bureau result.';
    else if (feature === 'actual-interest-collected') message = `Illustrative interest collected this financial year: ${money(Number(amount) * 0.085)}. Not a statement of actual bank charges.`;
    else if (feature === 'account-statement') message = `Statement filters applied${from ? ` from ${from}` : ''}${to ? ` to ${to}` : ''}. Sample entries are shown below.`;
    else if (['train-tickets','flights','bus'].includes(feature)) message = `Sample ${item.title.toLowerCase()} search prepared${from ? ` from ${from}` : ''}${to ? ` to ${to}` : ''}${date ? ` for ${date}` : ''}. Live booking is not connected.`;
    else if (feature === 'e-gift-card') message = `Gift card preview created for ${recipient || 'your recipient'} with a value of ${money(amount)}. No payment has been taken.`;
    else if (feature === 'shopping') message = `Demo offers filtered${query ? ` for “${query}”` : ''}. Checkout is not connected.`;
    else if (feature === 'healthcare') message = `Demo healthcare request prepared${query ? ` for ${query}` : ''}. No payment has been made.`;
    const entry = { id: Date.now(), message, date: new Date().toLocaleString('en-IN') };
    setResult(entry); setHistory((prev) => [entry, ...prev].slice(0, 5));
  }

  return <AuthenticatedLayout><div className="page-fade feature-hub">
    <div className="feature-hub__back"><Link to="/dashboard"><ArrowLeft size={16}/> Dashboard</Link><span>{isLoan ? 'Loans' : 'Lifestyle'}</span></div>
    <PageHeader title={item.title} subtitle={item.subtitle} />
    <div className="feature-hub__layout">
      <Card title={item.title} subtitle={item.description}>
        <form className="feature-form" onSubmit={submit}>
          {(['loan-repayment','instant-overdraft','gold-od-loan','loan-against-mutual-funds','actual-interest-collected','e-gift-card'].includes(feature)) && <label> {feature === 'e-gift-card' ? 'Gift card value (₹)' : feature === 'gold-od-loan' ? 'Estimated gold value (₹)' : feature === 'loan-against-mutual-funds' ? 'Mutual fund portfolio value (₹)' : feature === 'actual-interest-collected' ? 'Illustrative principal (₹)' : 'Loan amount (₹)'}<input type="number" min="1" required value={amount} onChange={e=>setAmount(e.target.value)}/></label>}
          {feature === 'loan-repayment' && <div className="feature-form__row"><label>Annual interest rate (%)<input type="number" min="0" max="50" step="0.1" value={rate} onChange={e=>setRate(e.target.value)} required/></label><label>Tenure (months)<input type="number" min="1" max="360" value={tenure} onChange={e=>setTenure(e.target.value)} required/></label></div>}
          {['train-tickets','flights','bus'].includes(feature) && <><div className="feature-form__row"><label>From<input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Origin city" required/></label><label>To<input value={to} onChange={e=>setTo(e.target.value)} placeholder="Destination city" required/></label></div><label>Travel date<input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().slice(0,10)} required/></label></>}
          {feature === 'account-statement' && <div className="feature-form__row"><label>From date<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>To date<input type="date" value={to} onChange={e=>setTo(e.target.value)} min={from || undefined}/></label></div>}
          {['healthcare','shopping'].includes(feature) && <label>{feature === 'healthcare' ? 'Provider or service' : 'Search catalogue'}<input value={query} onChange={e=>setQuery(e.target.value)} placeholder={feature === 'healthcare' ? 'e.g. clinic or pharmacy' : 'e.g. electronics or fashion'}/></label>}
          {feature === 'e-gift-card' && <label>Recipient name or email<input value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="Enter recipient" required/></label>}
          {feature === 'loan-details' && <div className="feature-data-grid"><div><small>Active loans</small><strong>1</strong></div><div><small>Outstanding balance</small><strong>₹4,25,000</strong></div><div><small>Next due date</small><strong>05 Nov 2026</strong></div></div>}
          {feature === 'actual-interest-collected' && <p className="feature-hub__note">Actual bank interest data is not connected. The result is an illustrative estimate only.</p>}
          <button className="feature-hub__submit" type="submit">{item.action}</button>
        </form>
      </Card>
      <Card title="Request status" subtitle="Your latest action appears here.">
        {result ? <div className="feature-result"><CheckCircle2 size={22}/><div><strong>Ready</strong><p>{result.message}</p><small>{result.date}</small></div></div> : <div className="feature-empty"><Clock3 size={25}/><p>Complete the form to see a result or preview here.</p></div>}
        {feature === 'loan-repayment' && <div className="feature-emi"><span>Estimated monthly EMI</span><strong>{money(emi)}</strong><small>Principal and interest estimate only</small></div>}
      </Card>
    </div>
    {feature === 'account-statement' && <Card title="Sample statement entries" subtitle="Illustrative transactions only."><div className="feature-table"><div><span>Date</span><span>Description</span><span>Amount</span></div><div><span>05 Oct 2026</span><span>Loan interest</span><strong>− ₹3,250</strong></div><div><span>05 Sep 2026</span><span>Loan repayment</span><strong>− ₹14,500</strong></div><div><span>05 Aug 2026</span><span>Loan repayment</span><strong>− ₹14,500</strong></div></div></Card>}
    {history.length > 0 && <Card title="Recent actions"><ul className="feature-history">{history.map(h=><li key={h.id}><FileText size={16}/><div><p>{h.message}</p><small>{h.date}</small></div></li>)}</ul></Card>}
    <p className="feature-hub__disclaimer"><Search size={14}/> FinCentral demo environment. Travel searches, credit scores, financial estimates and transactions are not connected to live providers and do not create bookings or financial commitments.</p>
  </div></AuthenticatedLayout>;
}

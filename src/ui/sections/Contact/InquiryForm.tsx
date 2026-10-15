import { useId, type CSSProperties, type ReactNode } from 'react';
import { INQUIRY_INTENTS, INQUIRY_OPTIONS } from '@/constants/inquiry';
import { useInquiryForm } from '@/hooks/useInquiryForm';
import type { InquiryField } from '@/types/inquiry';
import { ContactEnvelope } from './ContactEnvelope';
import { InquiryDatePicker } from './InquiryDatePicker';
import { Icon } from '@/ui/components/Icon';

const STABLE = new Set<InquiryField>(['name', 'email', 'organisation', 'message']);

export function InquiryForm() {
  const id = useId();
  const {
    formRef,
    draft,
    errors,
    status,
    animate,
    engaged,
    emailText,
    today,
    email,
    setKind,
    setField,
    submit,
    copy,
  } = useInquiryForm();
  const intent = INQUIRY_INTENTS.find((item) => item.kind === draft.kind) ?? INQUIRY_INTENTS[0]!;
  let order = 0;

  const field = (name: InquiryField, label: string, control: ReactNode, optional = false) => (
    <div
      key={STABLE.has(name) ? name : `${draft.kind}-${name}`}
      className="inquiry-field"
      data-field={name}
      data-invalid={errors[name] ? '' : undefined}
      style={{ '--i': order++ } as CSSProperties}
    >
      <label htmlFor={`${id}-${name}`}>
        {label}
        {optional && <span className="inquiry-optional"> (optional)</span>}
      </label>
      {control}
      {errors[name] && (
        <p className="inquiry-error" id={`${id}-${name}-error`}>
          {errors[name]}
        </p>
      )}
    </div>
  );
  const props = (name: InquiryField) => ({
    id: `${id}-${name}`,
    name,
    value: draft[name],
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
    onChange: (event: { target: { value: string } }) => setField(name, event.target.value),
  });
  const choose = (name: InquiryField, label: string, options: readonly string[]) =>
    field(
      name,
      label,
      <select {...props(name)}>
        <option value="">Choose…</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>,
    );

  return (
    <form
      ref={formRef}
      id="message"
      className="inquiry-form"
      data-kind={draft.kind}
      data-status={status}
      data-motion={animate ? 'running' : 'paused'}
      data-engaged={engaged ? '' : undefined}
      noValidate
      aria-labelledby={`${id}-title`}
      onSubmit={submit}
    >
      <div className="inquiry-head">
        <div>
          <span className="eyebrow">Send a message</span>
          <h2 id={`${id}-title`}>What can we help with?</h2>
        </div>
        <ContactEnvelope
          kind={draft.kind}
          fill={Math.min(1, draft.message.trim().length / 220)}
          animated={animate}
        />
      </div>
      <fieldset className="inquiry-intents">
        <legend className="sr-only">Kind of message</legend>
        {INQUIRY_INTENTS.map((item, index) => (
          <label
            key={item.kind}
            className="inquiry-intent"
            data-selected={item.kind === draft.kind ? '' : undefined}
          >
            <input
              type="radio"
              name="kind"
              value={item.kind}
              checked={draft.kind === item.kind}
              onChange={() => setKind(item.kind)}
            />
            <span className="inquiry-intent-index" aria-hidden="true">
              0{index + 1}
            </span>
            <span className="inquiry-intent-label">{item.label}</span>
            <span className="inquiry-intent-hint">{item.hint}</span>
          </label>
        ))}
      </fieldset>
      <div className="inquiry-grid">
        {field('name', 'Name', <input {...props('name')} autoComplete="name" />)}
        {field('email', 'Email', <input {...props('email')} type="email" autoComplete="email" />)}
        {field(
          'organisation',
          'Business or organisation',
          <input {...props('organisation')} autoComplete="organization" />,
          true,
        )}
        {draft.kind === 'quote' && [
          choose('service', 'Service', INQUIRY_OPTIONS.services),
          choose('timeline', 'Timeline', INQUIRY_OPTIONS.timelines),
          field('budget', 'Budget', <input {...props('budget')} />, true),
        ]}
        {draft.kind === 'appointment' && [
          field(
            'date',
            'Preferred date',
            <InquiryDatePicker
              id={`${id}-date`}
              value={draft.date}
              min={today}
              invalid={!!errors.date}
              describedBy={errors.date ? `${id}-date-error` : undefined}
              onChange={(value) => setField('date', value)}
            />,
          ),
          choose('time', 'Preferred time', INQUIRY_OPTIONS.times),
          <fieldset
            key="appointment-format"
            className="inquiry-field inquiry-format"
            data-invalid={errors.format ? '' : undefined}
            aria-describedby={errors.format ? `${id}-format-error` : undefined}
            style={{ '--i': order++ } as CSSProperties}
          >
            <legend>Meeting</legend>
            <div>
              {INQUIRY_OPTIONS.formats.map((format) => (
                <label key={format} data-selected={draft.format === format ? '' : undefined}>
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={draft.format === format}
                    onChange={() => setField('format', format)}
                  />
                  <span className="inquiry-format-card">
                    <Icon
                      name={format === 'Online' ? 'video' : 'pin'}
                      className="inquiry-format-icon"
                    />
                    <span className="inquiry-format-copy">
                      <span className="inquiry-format-name">{format}</span>
                      <span className="inquiry-format-hint" aria-hidden="true">
                        {format === 'Online' ? 'A video conversation' : 'Meet face to face'}
                      </span>
                    </span>
                    <span className="inquiry-format-check" aria-hidden="true">
                      <Icon name="check" />
                    </span>
                  </span>
                </label>
              ))}
            </div>
            {errors.format && (
              <p className="inquiry-error" id={`${id}-format-error`}>
                {errors.format}
              </p>
            )}
          </fieldset>,
        ]}
        <div className="inquiry-wide">
          {field(
            'message',
            'Your message',
            <textarea {...props('message')} rows={5} placeholder={intent.prompt} />,
          )}
        </div>
      </div>
      <div className="inquiry-actions">
        <button type="submit" className="inquiry-send">
          <span>{status === 'editing' ? 'Send message' : 'Send again'}</span>
          <Icon name="arrow" className="inline-icon inquiry-send-arrow" />
        </button>
        <p className="inquiry-note">
          Opens your email app with everything filled in, addressed to{' '}
          <a href={`mailto:${email}`}>{email}</a>.
        </p>
      </div>
      <div className="inquiry-status" role="status">
        {status !== 'editing' && (
          <p>
            {status === 'copied'
              ? `Copied. Paste it into a new email to ${email}.`
              : status === 'copy-error'
                ? 'Automatic copying is unavailable. Select and copy your message below.'
                : 'Your email app should open with the message ready to send.'}{' '}
            {status === 'sent' && (
              <button type="button" className="inquiry-copy" onClick={() => void copy()}>
                Didn’t open? Copy the message
              </button>
            )}
          </p>
        )}
      </div>
      {status === 'copy-error' && (
        <div className="inquiry-field">
          <label htmlFor={`${id}-composed`}>Message to copy</label>
          <textarea id={`${id}-composed`} readOnly rows={8} value={emailText} />
        </div>
      )}
    </form>
  );
}

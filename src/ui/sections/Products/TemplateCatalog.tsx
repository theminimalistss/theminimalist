import { Icon } from '@/ui/components/Icon';
import { useTemplateCatalog } from '@/hooks/useTemplateCatalog';
import { CONTACT_LINKS } from '@/router/paths';
import { PageLink } from '@/ui/components/PageLink';
import { TemplatePreview } from './TemplatePreview';

export function TemplateCatalog() {
  const { state, category, chooseCategory, templates, categories, shown } = useTemplateCatalog();

  if (state.status === 'error') return <p className="template-catalog-error">{state.message}</p>;
  return (
    <div className="template-catalog">
      <div className="template-filters" role="group" aria-label="Filter templates">
        {[null, ...categories].map((item) => (
          <button
            key={item ?? 'all'}
            type="button"
            aria-pressed={item === category}
            onClick={() => chooseCategory(item)}
          >
            {item ?? 'All'}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">
        {state.status === 'loading'
          ? 'Loading templates…'
          : `${shown.length} template ${shown.length === 1 ? 'direction' : 'directions'}`}
      </p>
      <ul
        className="template-grid"
        aria-label="Website templates"
        aria-busy={state.status === 'loading'}
      >
        {shown.map((template) => (
          <li key={template.id} className="template-card">
            <TemplatePreview layout={template.layout} />
            <div className="template-card-body">
              <span className="eyebrow">
                {String(templates.indexOf(template) + 1).padStart(2, '0')} — {template.category}
              </span>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <ul className="template-features" aria-label={`${template.name} includes`}>
                <li>
                  {template.pages} {template.pages === 1 ? 'page' : 'pages'}
                </li>
                {template.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <PageLink className="text-button" to={CONTACT_LINKS.quote}>
                Ask about {template.name} <Icon name="arrow" className="inline-icon" />
              </PageLink>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

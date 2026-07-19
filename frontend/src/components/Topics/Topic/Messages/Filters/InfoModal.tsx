import React from 'react';
import * as S from 'components/Topics/Topic/Messages/Filters/Filters.styled';
import { Button } from 'components/common/Button/Button';
import Flexbox from 'components/common/FlexBox/FlexBox';

interface InfoModalProps {
  toggleIsOpen(): void;
}

const CEL_SPEC_LINK =
  'https://github.com/cel-expr/cel-spec/blob/master/doc/langdef.md';
const DOCS_LINK = 'https://ui.docs.kafbat.io/faq/filtering';

const InfoModal: React.FC<InfoModalProps> = ({ toggleIsOpen }) => {
  return (
    <S.InfoModal>
      <S.InfoHeading>Smart filters use CEL syntax</S.InfoHeading>
      <S.InfoParagraph>
        Each message is checked against the{' '}
        <a href={CEL_SPEC_LINK} target="_blank" rel="noreferrer">
          CEL (Common Expression Language)
        </a>{' '}
        expression you provide. The expression must evaluate to a boolean —{' '}
        <code>true</code> keeps the message, <code>false</code> hides it. A
        script that fails to compile is rejected when you save it; a script that
        throws (or returns a non-boolean) while checking one specific message
        just skips that message — your session keeps going, watch the small
        errors counter near the message list if you think messages are being
        dropped unexpectedly.
      </S.InfoParagraph>

      <S.InfoParagraph>
        <b>Variables bound to the context</b> — this is the complete list (all
        live under the <code>record</code> variable):
      </S.InfoParagraph>
      <ul aria-label="context-variables">
        <S.ListItem>
          <code>record.key</code> — message key, parsed as a JSON object when
          possible
        </S.ListItem>
        <S.ListItem>
          <code>record.keyAsText</code> — raw message key as a string
        </S.ListItem>
        <S.ListItem>
          <code>record.value</code> — message value, parsed as a JSON object
          when possible
        </S.ListItem>
        <S.ListItem>
          <code>record.valueAsText</code> — raw message value as a string
        </S.ListItem>
        <S.ListItem>
          <code>record.headers</code> — message headers, a{' '}
          <code>map&lt;string, string&gt;</code>. If a message has more than one
          header with the same key, only the last one is kept.
        </S.ListItem>
        <S.ListItem>
          <code>record.partition</code> — partition number
        </S.ListItem>
        <S.ListItem>
          <code>record.offset</code> — message offset
        </S.ListItem>
        <S.ListItem>
          <code>record.timestampMs</code> — message timestamp, in epoch
          milliseconds
        </S.ListItem>
      </ul>
      <S.InfoParagraph>
        Other message properties shown elsewhere in the UI — sizes, timestamp
        type, serde name, schema metadata — aren&apos;t available here.
      </S.InfoParagraph>

      <S.InfoParagraph>
        <b>JSON parsing:</b> <code>key</code> and <code>value</code> are bound
        as JSON objects only when they contain a JSON object, otherwise they
        stay raw strings (use <code>keyAsText</code> / <code>valueAsText</code>{' '}
        for those). When a key or value is absent it is not set, so guard access
        with <code>has(...)</code>, e.g. <code>has(record.key)</code> or{' '}
        <code>has(record.valueAsText)</code> — this also applies to map keys
        like <code>record.headers[&apos;x&apos;]</code>. <code>has()</code> only
        guards the last step of a path, so for a nested path guard every
        optional level, innermost last. JSON <code>null</code>s nested in
        objects can be compared with <code>== null</code> (nulls inside JSON
        arrays aren&apos;t supported and raise an error).
      </S.InfoParagraph>

      <S.InfoParagraph>
        <b>Filter examples:</b>
      </S.InfoParagraph>
      <ol aria-label="filter-examples">
        <S.ListItem>
          <code>record.partition == 1</code> - match a partition
        </S.ListItem>
        <S.ListItem>
          <code>
            has(record.valueAsText) && record.valueAsText == &apos;some
            text&apos;
          </code>{' '}
          - exact value match
        </S.ListItem>
        <S.ListItem>
          <code>
            has(record.keyAsText) &&
            record.keyAsText.matches(&apos;.*[Ee]rror.*&apos;)
          </code>{' '}
          - RE2 regex (not Java regex) on the key as a string; matches anywhere
          unless anchored with <code>^...$</code>
        </S.ListItem>
        <S.ListItem>
          <code>
            has(record.value.name) && has(record.value.name.first) &&
            record.value.name.first == &apos;user1&apos;
          </code>{' '}
          - access a nested field of a JSON value (guard every optional level,
          innermost last)
        </S.ListItem>
        <S.ListItem>
          <code>
            record.headers.size() == 1 && has(record.headers.k2) &&
            record.headers[&apos;k2&apos;] == &apos;v2&apos;
          </code>{' '}
          - inspect headers
        </S.ListItem>
        <S.ListItem>
          <code>
            has(record.valueAsText) &&
            record.valueAsText.split(&apos;.&apos;).size() &gt; 1 &&
            string(base64.decode(record.valueAsText.split(&apos;.&apos;)[1])).contains(&apos;user1&apos;)
          </code>{' '}
          - decode and search a base64 segment, guarded against messages with no
          value. Note <code>base64.decode</code> expects standard base64, not
          the URL-safe base64url a real JWT uses.
        </S.ListItem>
      </ol>

      <S.InfoParagraph>
        See the{' '}
        <a href={CEL_SPEC_LINK} target="_blank" rel="noreferrer">
          CEL language definition
        </a>{' '}
        for the full syntax, or the{' '}
        <a href={DOCS_LINK} target="_blank" rel="noreferrer">
          message filtering docs
        </a>{' '}
        for more examples, the full list of available fields, and how runtime
        errors during consumption are handled.
      </S.InfoParagraph>

      <Flexbox justifyContent="center" margin="20px 0 0 0">
        <Button
          buttonSize="M"
          buttonType="secondary"
          type="button"
          onClick={toggleIsOpen}
        >
          Ok
        </Button>
      </Flexbox>
    </S.InfoModal>
  );
};

export default InfoModal;

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PaperInfoSection } from '@/components/archive/PaperInfoSection';

describe('PaperInfoSection — 날짜 가드', () => {
  it('startDate·endDate 둘 다 있으면 "시작 - 종료" 형식으로 렌더한다', () => {
    render(<PaperInfoSection title="김루카의 파티" startDate="26.05.12" endDate="26.05.19" />);

    expect(screen.getByRole('heading', { name: '김루카의 파티' })).toBeInTheDocument();
    expect(screen.getByText('26.05.12 - 26.05.19')).toBeInTheDocument();
  });

  it('startDate만 있으면 구분자(" - ") 없이 시작일만 렌더한다', () => {
    render(<PaperInfoSection title="김루카의 파티" startDate="26.05.12" endDate="" />);

    expect(screen.getByText('26.05.12')).toBeInTheDocument();
    // 구분자가 붙은 형식은 나타나지 않아야 한다
    expect(screen.queryByText(/-/)).not.toBeInTheDocument();
  });

  it('endDate만 있으면 구분자(" - ") 없이 종료일만 렌더한다', () => {
    render(<PaperInfoSection title="김루카의 파티" startDate="" endDate="26.05.19" />);

    expect(screen.getByText('26.05.19')).toBeInTheDocument();
    expect(screen.queryByText(/-/)).not.toBeInTheDocument();
  });

  it('startDate·endDate 둘 다 빈 문자열이면 날짜 줄 자체를 렌더하지 않는다', () => {
    const { container } = render(
      <PaperInfoSection title="김루카의 파티" startDate="" endDate="" />,
    );

    // 제목은 그대로 노출
    expect(screen.getByRole('heading', { name: '김루카의 파티' })).toBeInTheDocument();
    // 날짜를 담는 L1(span)이 렌더되지 않아 section에는 heading만 남는다
    expect(screen.queryByText(/-/)).not.toBeInTheDocument();
    expect(container.querySelector('span')).toBeNull();
  });
});

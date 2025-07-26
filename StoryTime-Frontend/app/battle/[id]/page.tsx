import BattleDetail from '../../../components/battles/BattleDetail';

interface BattlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BattlePage({ params }: BattlePageProps) {
  const { id } = await params;
  return <BattleDetail battleId={id} />;
}
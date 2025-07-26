import BattleDetail from '../../../components/battles/BattleDetail';

interface BattlePageProps {
  params: {
    id: string;
  };
}

export default function BattlePage({ params }: BattlePageProps) {
  return <BattleDetail battleId={params.id} />;
}
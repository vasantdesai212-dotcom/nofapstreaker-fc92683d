import { useAppState } from '@/lib/AppContext';
import { getCarTemplate } from '@/lib/cars';
import { Trophy } from 'lucide-react';

import porscheImg from '@/assets/porsche-911-gt3rs.jpg';
import bmwImg from '@/assets/bmw-m5-cs.jpg';
import lamboImg from '@/assets/lamborghini-huracan-sto.jpg';
import mustangImg from '@/assets/ford-mustang-shelby.jpg';
import gwagonImg from '@/assets/mercedes-g-wagon.jpg';
import rollsImg from '@/assets/rolls-royce-wraith.jpg';

const carImages: Record<string, string> = {
  'porsche-911-gt3rs': porscheImg,
  'bmw-m5-cs': bmwImg,
  'lamborghini-huracan-sto': lamboImg,
  'ford-mustang-shelby': mustangImg,
  'mercedes-g-wagon': gwagonImg,
  'rolls-royce-wraith': rollsImg,
};

const Garage = () => {
  const { state } = useAppState();
  const { garage } = state;

  return (
    <div className="px-6 pt-6 pb-28">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-black">Your Garage</h1>
          <span className="ml-auto text-sm text-muted-foreground">{garage.length} car{garage.length !== 1 ? 's' : ''}</span>
        </div>

        {garage.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <p className="text-muted-foreground text-sm">No cars yet. Complete a 30-day cycle to earn your first.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {garage.map((item) => {
              const car = getCarTemplate(item.carTemplateId);
              if (!car) return null;
              const img = carImages[car.id];
              return (
                <div key={item.id} className="glass-panel rounded-2xl overflow-hidden">
                  <img
                    src={img}
                    alt={`${car.manufacturer} ${car.name}`}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">{car.manufacturer}</p>
                      <p className="text-lg font-bold">{car.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-sm font-semibold text-primary">{item.completedDate}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Garage;

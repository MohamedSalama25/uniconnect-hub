import { MapPin, Star, Heart, Eye, MessageCircle, Bed, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Accommodation } from '@/data/mockData';
import { Action } from '@radix-ui/react-toast';
import { cn, formatImageUrl } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { houseService } from '@/features/accommodation-list/services/house.service';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AccommodationCardProps {
  accommodation: Accommodation;
}

export function AccommodationCard({ accommodation }: AccommodationCardProps) {
  const [isFavorite, setIsFavorite] = useState(accommodation.isFavorite || false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/accommodation/${accommodation.id}`);
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await houseService.toggleFavorite(Number(accommodation.id));
      setIsFavorite(!isFavorite);
      toast.success(!isFavorite ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة");
    } catch (error) {
      toast.error("فشل في تحديث المفضلة");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden shadow-card card-hover cursor-pointer group"
      onClick={handleNavigate}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={formatImageUrl(accommodation.image)}
          alt={accommodation.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

        {/* Type Badge */}
        <Badge
          className={cn(
            'absolute top-3 right-3',
            accommodation.type === 'private'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground'
          )}
        >
          {accommodation.type === 'private' ? 'خاص' : 'مشترك'}
        </Badge>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading}
          className={cn(
            'absolute top-3 left-3 rounded-full bg-card/80 backdrop-blur-sm',
            isFavorite && 'text-destructive'
          )}
          onClick={handleToggleFavorite}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Heart className={cn('w-5 h-5', isFavorite && 'fill-current')} />
          )}
        </Button>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-lg font-bold text-primary">{accommodation.price}</span>
          <span className="text-sm text-muted-foreground"> جنيه/شهر</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-lg line-clamp-1">{accommodation.title}</h3>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="w-4 h-4" />
          <span>{accommodation.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{accommodation.bedrooms} غرف</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{accommodation.bathrooms} حمام</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="font-medium text-foreground">{accommodation.rating}</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5">
          {accommodation.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {accommodation.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{accommodation.amenities.length - 3}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 btn-hover" size="sm">
            <Eye className="w-4 h-4 ml-2" />
            التفاصيل
          </Button>
        </div>
      </div>
    </div>
  );
}

import { SocialFeed } from './social-feed';

export function PublicFeed() {
  return (
    <div className="container mx-auto pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Comunidad Padel Core
        </h1>
        <SocialFeed />
      </div>
    </div>
  );
}
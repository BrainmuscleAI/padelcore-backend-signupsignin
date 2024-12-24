# Supabase Implementation Guide for Padel Core

## Project Structure Overview

### Database Schema
```sql
-- Core Tables
users
  - id (uuid, references auth.users)
  - email (text)
  - created_at (timestamp)
  - role (text)

profiles
  - id (uuid, references users)
  - username (text)
  - full_name (text)
  - avatar_url (text)
  - rating (integer)
  - matches_played (integer)
  - wins (integer)
  - losses (integer)

tournaments
  - id (uuid)
  - name (text)
  - description (text)
  - start_date (timestamp)
  - end_date (timestamp)
  - location (text)
  - prize_pool (integer)
  - status (text)
  - max_participants (integer)

tournament_registrations
  - id (uuid)
  - tournament_id (uuid, references tournaments)
  - user_id (uuid, references profiles)
  - registration_date (timestamp)
  - status (text)

matches
  - id (uuid)
  - tournament_id (uuid, references tournaments)
  - date (timestamp)
  - court (text)
  - status (text)
  - score (text)
  - winner_id (uuid, references profiles)

match_players
  - match_id (uuid, references matches)
  - player_id (uuid, references profiles)
  - team (integer)

posts
  - id (uuid)
  - user_id (uuid, references profiles)
  - content (text)
  - image_url (text)
  - created_at (timestamp)

comments
  - id (uuid)
  - post_id (uuid, references posts)
  - user_id (uuid, references profiles)
  - content (text)
  - created_at (timestamp)

notifications
  - id (uuid)
  - user_id (uuid, references profiles)
  - type (text)
  - content (text)
  - read (boolean)
  - created_at (timestamp)
```

### Frontend Integration Points

1. Authentication (`src/components/auth/`)
   - SignInDialog
   - SignUpDialog
   - AuthProvider
   - UserMenu

2. User Profile (`src/components/profile/`)
   - ProfileView
   - ProfileEdit
   - ProfileStats

3. Tournament System (`src/components/tournaments/`)
   - TournamentsList
   - TournamentDetails
   - Registration

4. Match Management (`src/components/matches/`)
   - MatchList
   - MatchDetails
   - LiveScore

5. Social Features (`src/components/social/`)
   - Feed
   - PostCreate
   - Comments

6. Notifications (`src/components/notifications/`)
   - NotificationsList
   - NotificationsBell

### Data Flow Architecture

1. Supabase Client Setup
   ```typescript
   // src/lib/supabase.ts
   import { createClient } from '@supabase/supabase-js';
   ```

2. Type Definitions
   ```typescript
   // src/types/database.ts
   export interface Database {
     public: {
       Tables: {
         // Table definitions
       }
     }
   }
   ```

3. Custom Hooks
   ```typescript
   // src/hooks/use-supabase.ts
   // src/hooks/use-profile.ts
   // src/hooks/use-tournaments.ts
   // src/hooks/use-matches.ts
   ```

### Implementation Phases

1. **Foundation (Phase 1)**
   - Supabase setup
   - Environment configuration
   - Base client implementation
   - Type generation

2. **Authentication (Phase 2)**
   - User signup/signin
   - Session management
   - Profile creation
   - Role-based access

3. **Core Features (Phase 3)**
   - Tournament management
   - Match tracking
   - Player rankings
   - Social interactions

4. **Real-time Features (Phase 4)**
   - Live match updates
   - Notifications
   - Chat system
   - Activity feed

### Testing Strategy

1. Unit Tests
   - Auth flows
   - Data mutations
   - Component rendering

2. Integration Tests
   - User journeys
   - Data persistence
   - Real-time updates

3. E2E Tests
   - Complete user flows
   - Cross-feature interactions

### Security Considerations

1. Row Level Security (RLS)
   - User data protection
   - Role-based access
   - Content ownership

2. Data Validation
   - Input sanitization
   - Type checking
   - Error handling

3. Rate Limiting
   - API calls
   - Real-time connections
   - File uploads

### Error Handling

1. Network Errors
   ```typescript
   try {
     const { data, error } = await supabase.from('table').select();
     if (error) throw error;
   } catch (error) {
     // Handle error
   }
   ```

2. User Feedback
   - Toast notifications
   - Error boundaries
   - Loading states

### Deployment Checklist

1. Environment Variables
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

2. Build Configuration
   - Type generation
   - Environment setup
   - Asset optimization

3. Database Migrations
   - Schema updates
   - Data seeding
   - RLS policies
export interface Answer {
    accepted?: boolean;
    answer_id: number;
    awarded_bounty_amount?: number;
    awarded_bounty_users?: ShallowUser[];
    body?: string;
    body_markdown?: string;
    can_comment?: boolean;
    can_edit?: boolean;
    can_flag?: boolean;
    can_suggest_edit?: boolean;
    collectives: Collective[];
    comment_count?: number;
    comments?: Comment[];
    community_owned_date: Date;
    content_license: string;
    creation_date: Date;
    down_vote_count?: number;
    downvoted?: boolean;
    is_accepted: boolean;
    last_activity_date: Date;
    last_edit_date: Date;
    last_editor?: ShallowUser;
    link?: string;
    locked_date: Date;
    owner: ShallowUser;
    posted_by_collectives: Collective[];
    question_id: number;
    recommendations: CollectiveRecommendation[];
    score: number;
    share_link?: string;
    tags?: string[];
    title?: string;
    up_vote_count?: number;
    upvoted?: boolean;
}

export interface AccessToken {
    access_token: string;
    account_id: number;
    expires_on_date: Date;
    scope: string[];
}

export interface Achievement {
    account_id: number;
    achievement_type: "badge" | "privilege" | "reputation";
    badge_rank: "gold" | "silver" | "bronze";
    creation_date: Date;
    is_unread: boolean;
    link: string;
    on_site: Site;
    reputation_change: number;
    title: string;
}

export interface Badge {
    award_count: number;
    badge_id: number;
    badge_type: "named" | "tag_based";
    description?: string;
    link: string;
    name: string;
    rank: "gold" | "silver" | "bronze";
    user: ShallowUser;
}

export interface Collective {
    description: string;
    external_links: CollectiveExternalLink[];
    link: string;
    name: string;
    slug: string;
    tags: string[];
}

export interface CollectiveReport {
    activity_report_dimensions?: ("date" | "page_views" | "unique_users" | "tag" | "total_questions" | "open_question" | "answered_questions" | "total_comments" | "total_answers" | "community_member_questions" | "community_member_answers" | "community_member_comments" | "percent_response_24hrs" | "percent_answer_24hrss")[];
    collective: Collective;
    creation_date: Date;
    dimensions: string[];
    download_link: string;
    end_date: Date;
    health_report_dimensions?: ("date" | "page_views" | "unique_users" | "tag" | "total_questions" | "open_question" | "answered_questions" | "total_comments" | "total_answers" | "community_member_questions" | "community_member_answers" | "community_member_comments" | "percent_response_24hrs" | "percent_answer_24hrss")[];
    included_tags: string[];
    metrics: string[];
    name: string;
    report_id: number;
    report_type: "unknown" | "user" | "activity" | "health";
    start_date: Date;
    state: "pending" | "complete";
    users_report_dimensions?: ("date" | "page_views" | "unique_users" | "tag" | "total_questions" | "open_question" | "answered_questions" | "total_comments" | "total_answers" | "community_member_questions" | "community_member_answers" | "community_member_comments" | "percent_response_24hrs" | "percent_answer_24hrss")[];
}

export interface Comment {
    body?: string;
    body_markdown?: string;
    can_flag?: boolean;
    comment_id: number;
    content_license: string;
    creation_date: Date;
    edited: boolean;
    link?: string;
    owner: ShallowUser;
    post_id: number;
    post_type?: "question" | "answer" | "article";
    reply_to_user: ShallowUser;
    score: number;
    upvoted?: boolean;
}

export interface Error {
    description: string;
    error_id: number;
    error_name: string;
}

export interface Event {
    creation_date: Date;
    event_id: number;
    event_type: "question_posted" | "answer_posted" | "comment_posted" | "post_edited" | "user_created";
    excerpt?: string;
    link?: string;
}

export interface Filter {
    filter: string;
    filter_type: "safe" | "unsafe" | "invalid";
    included_fields: string[];
}

export interface FlagOption {
    count: number;
    description: string;
    dialog_title: string;
    has_flagged: boolean;
    is_retraction: boolean;
    option_id: number;
    question?: Question;
    requires_comment: boolean;
    requires_question_id: boolean;
    requires_site: boolean;
    sub_options: FlagOption[];
    title: string;
}

export interface InboxItem {
    answer_id: number;
    body?: string;
    comment_id: number;
    creation_date: Date;
    is_unread: boolean;
    item_type: "comment" | "chat_message" | "new_answer" | "careers_message" | "careers_invitations" | "meta_question" | "post_notice" | "moderator_message" | "question_update" | "followed_post_activity" | "subcommunity_endorsement" | "subcommunity_leaderboard";
    link: string;
    question_id: number;
    site: Site;
    title: string;
}

export interface Info {
    answers_per_minute: number;
    api_revision: string;
    badges_per_minute: number;
    new_active_users: number;
    questions_per_minute: number;
    site?: Site;
    total_accepted: number;
    total_answers: number;
    total_badges: number;
    total_comments: number;
    total_questions: number;
    total_unanswered: number;
    total_users: number;
    total_votes: number;
}

export interface NetworkUser {
    account_id: number;
    answer_count: number;
    badge_counts: BadgeCount;
    creation_date: Date;
    last_access_date: Date;
    question_count: number;
    reputation: number;
    site_name: string;
    site_url: string;
    top_answers?: NetworkPost[];
    top_questions?: NetworkPost[];
    user_id: number;
    user_type?: "unregistered" | "registered" | "moderator" | "team_admin" | "does_not_exist";
}

export interface AccountMerge {
    merge_date: Date;
    new_account_id: number;
    old_account_id: number;
}

export interface NetworkActivity {
    account_id: number;
    activity_type: "question_posted" | "answer_posted" | "badge_earned" | "comment_posted";
    api_site_parameter: string;
    badge_id: number;
    creation_date: Date;
    description: string;
    link: string;
    post_id: number;
    score: number;
    tags: string[];
    title: string;
}

export interface Notification {
    body: string;
    creation_date: Date;
    is_unread: boolean;
    notification_type: "generic" | "profile_activity" | "bounty_expired" | "bounty_expires_in_one_day" | "badge_earned" | "bounty_expires_in_three_days" | "reputation_bonus" | "accounts_associated" | "new_privilege" | "post_migrated" | "moderator_message" | "registration_reminder" | "edit_suggested" | "substantive_edit" | "bounty_grace_period_started";
    post_id: number;
    site: Site;
}

export interface Post {
    body?: string;
    body_markdown?: string;
    collectives: Collective[];
    comment_count?: number;
    comments?: Comment[];
    content_license: string;
    creation_date: Date;
    down_vote_count?: number;
    downvoted?: boolean;
    last_activity_date: Date;
    last_edit_date: Date;
    last_editor?: ShallowUser;
    link: string;
    owner: ShallowUser;
    post_id: number;
    post_type: "question" | "answer" | "article";
    posted_by_collectives: Collective[];
    score: number;
    share_link?: string;
    title?: string;
    up_vote_count?: number;
    upvoted?: boolean;
}

export interface Privilege {
    description: string;
    reputation: number;
    short_description: string;
}

export interface Question {
    accepted_answer_id: number;
    answer_count: number;
    answers?: Answer[];
    body?: string;
    body_markdown?: string;
    bounty_amount: number;
    bounty_closes_date: Date;
    bounty_user?: ShallowUser;
    can_answer?: boolean;
    can_close?: boolean;
    can_comment?: boolean;
    can_edit?: boolean;
    can_flag?: boolean;
    can_suggest_edit?: boolean;
    close_vote_count?: number;
    closed_date: Date;
    closed_details?: ClosedDetails;
    closed_reason: string;
    collectives: Collective[];
    comment_count?: number;
    comments?: Comment[];
    community_owned_date: Date;
    content_license: string;
    creation_date: Date;
    delete_vote_count?: number;
    down_vote_count?: number;
    downvoted?: boolean;
    favorite_count?: number;
    favorited?: boolean;
    is_answered: boolean;
    last_activity_date: Date;
    last_edit_date: Date;
    last_editor?: ShallowUser;
    link: string;
    locked_date: Date;
    migrated_from: MigrationInfo;
    migrated_to: MigrationInfo;
    notice?: Notice;
    owner: ShallowUser;
    posted_by_collectives: Collective[];
    protected_date: Date;
    question_id: number;
    reopen_vote_count?: number;
    score: number;
    share_link?: string;
    tags: string[];
    title: string;
    up_vote_count?: number;
    upvoted?: boolean;
    view_count: number;
}

export interface QuestionTimeline {
    comment_id: number;
    content_license: string;
    creation_date: Date;
    down_vote_count: number;
    owner: ShallowUser;
    post_id: number;
    question_id: number;
    revision_guid: string;
    timeline_type: "question" | "answer" | "comment" | "unaccepted_answer" | "accepted_answer" | "vote_aggregate" | "revision" | "post_state_changed";
    up_vote_count: number;
    user: ShallowUser;
}

export interface Reputation {
    link?: string;
    on_date: Date;
    post_id: number;
    post_type: "question" | "answer" | "article";
    reputation_change: number;
    title?: string;
    user_id: number;
    vote_type: "accepts" | "up_votes" | "down_votes" | "bounties_offered" | "bounties_won" | "spam" | "suggested_edits";
}

export interface ReputationHistory {
    creation_date: Date;
    post_id: number;
    reputation_change: number;
    reputation_history_type: "asker_accepts_answer" | "asker_unaccept_answer" | "answer_accepted" | "answer_unaccepted" | "voter_downvotes" | "voter_undownvotes" | "post_downvoted" | "post_undownvoted" | "post_upvoted" | "post_unupvoted" | "suggested_edit_approval_received" | "post_flagged_as_spam" | "post_flagged_as_offensive" | "bounty_given" | "bounty_earned" | "bounty_cancelled" | "post_deleted" | "post_undeleted" | "association_bonus" | "arbitrary_reputation_change" | "vote_fraud_reversal" | "post_migrated" | "user_deleted" | "example_upvoted" | "example_unupvoted" | "proposed_change_approved" | "doc_link_upvoted" | "doc_link_unupvoted" | "doc_source_removed" | "suggested_edit_approval_overridden";
    user_id: number;
}

export interface Revision {
    body?: string;
    comment: string;
    content_license: string;
    creation_date: Date;
    is_rollback: boolean;
    last_body?: string;
    last_tags: string[];
    last_title: string;
    post_id: number;
    post_type: "question" | "answer" | "article";
    revision_guid: string;
    revision_number: number;
    revision_type: "single_user" | "vote_based";
    set_community_wiki: boolean;
    tags: string[];
    title: string;
    user: ShallowUser;
}

export interface SearchExcerpt {
    answer_count: number;
    answer_id: number;
    body: string;
    closed_date?: Date;
    community_owned_date?: Date;
    creation_date: Date;
    equivalent_tag_search: string[];
    excerpt: string;
    has_accepted_answer: boolean;
    is_accepted: boolean;
    is_answered: boolean;
    item_type: "question" | "answer";
    last_activity_date: Date;
    last_activity_user?: ShallowUser;
    locked_date?: Date;
    owner?: ShallowUser;
    question_id: number;
    question_score: number;
    score: number;
    tags: string[];
    title: string;
}

export interface Site {
    aliases: string[];
    api_site_parameter: string;
    audience: string;
    closed_beta_date: Date;
    favicon_url: string;
    high_resolution_icon_url: string;
    icon_url: string;
    launch_date: Date;
    logo_url: string;
    markdown_extensions: ("MathJax" | "Prettify" | "Balsamiq" | "jTab" | "strings")[];
    name: string;
    open_beta_date: Date;
    related_sites: RelatedSite[];
    site_state: "normal" | "closed_beta" | "open_beta" | "linked_meta";
    site_type: "main_site" | "meta_site";
    site_url: string;
    styling: Styling;
    twitter_account: string;
}

export interface SuggestedEdit {
    approval_date: Date;
    body?: string;
    comment: string;
    creation_date: Date;
    post_id: number;
    post_type: "question" | "answer" | "article";
    proposing_user: ShallowUser;
    rejection_date: Date;
    suggested_edit_id: number;
    tags: string[];
    title: string;
}

export interface Tag {
    collectives: Collective[];
    count: number;
    has_synonyms: boolean;
    is_moderator_only: boolean;
    is_required: boolean;
    last_activity_date?: Date;
    name: string;
    synonyms?: string[];
    user_id: number;
}

export interface TagPreference {
    tag_name: string;
    tag_preference_type: "favorite_tag" | "ignored_tag";
    user_id: number;
}

export interface TagScore {
    post_count: number;
    score: number;
    user: ShallowUser;
}

export interface TagSynonym {
    applied_count: number;
    creation_date: Date;
    from_tag: string;
    last_applied_date: Date;
    to_tag: string;
}

export interface TagWiki {
    body?: string;
    body_last_edit_date: Date;
    excerpt: string;
    excerpt_last_edit_date: Date;
    last_body_editor?: ShallowUser;
    last_excerpt_editor?: ShallowUser;
    tag_name: string;
}

export interface TopTag {
    answer_count: number;
    answer_score: number;
    question_count: number;
    question_score: number;
    tag_name: string;
    user_id: number;
}

export interface User {
    about_me?: string;
    accept_rate: number;
    account_id: number;
    age: number;
    answer_count?: number;
    badge_counts: BadgeCount;
    collectives: CollectiveMembership[];
    creation_date: Date;
    display_name: string;
    down_vote_count?: number;
    is_employee: boolean;
    last_access_date: Date;
    last_modified_date: Date;
    link: string;
    location: string;
    profile_image: string;
    question_count?: number;
    reputation: number;
    reputation_change_day: number;
    reputation_change_month: number;
    reputation_change_quarter: number;
    reputation_change_week: number;
    reputation_change_year: number;
    timed_penalty_date: Date;
    up_vote_count?: number;
    user_id: number;
    user_type: "unregistered" | "registered" | "moderator" | "team_admin" | "does_not_exist";
    view_count?: number;
    website_url: string;
}

export interface UserTimeline {
    badge_id: number;
    comment_id: number;
    creation_date: Date;
    detail: string;
    link?: string;
    post_id: number;
    post_type: "question" | "answer" | "article";
    suggested_edit_id: number;
    timeline_type: "commented" | "asked" | "answered" | "badge" | "revision" | "accepted" | "reviewed" | "suggested";
    title: string;
    user_id: number;
}

export interface WritePermission {
    can_add: boolean;
    can_delete: boolean;
    can_edit: boolean;
    max_daily_actions: number;
    min_seconds_between_actions: number;
    object_type: string;
    user_id: number;
}

export interface ShallowUser {
    accept_rate: number;
    account_id: number;
    badge_counts?: BadgeCount;
    display_name: string;
    link: string;
    profile_image: string;
    reputation: number;
    user_id: number;
    user_type: "unregistered" | "registered" | "moderator" | "team_admin" | "does_not_exist";
}

export interface CollectiveExternalLink {
    link: string;
    type: "website" | "twitter" | "github" | "facebook" | "instagram" | "support";
}

export interface CollectiveRecommendation {
    collective: Collective;
    creation_date: Date;
}

export interface BadgeCount {
    bronze: number;
    gold: number;
    silver: number;
}

export interface NetworkPost {
    post_id: number;
    post_type: "question" | "answer" | "article";
    score: number;
    title: string;
}

export interface ClosedDetails {
    by_users: ShallowUser[];
    description: string;
    on_hold: boolean;
    original_questions: OriginalQuestion[];
    reason: string;
}

export interface OriginalQuestion {
    accepted_answer_id: number;
    answer_count: number;
    question_id: number;
    title: string;
}

export interface MigrationInfo {
    on_date: Date;
    other_site: Site;
    question_id: number;
}

export interface Notice {
    body: string;
    creation_date: Date;
    owner_user_id: number;
}

export interface RelatedSite {
    api_site_parameter: string;
    name: string;
    relation: "parent" | "meta" | "chat";
    site_url: string;
}

export interface Styling {
    link_color: string;
    tag_background_color: string;
    tag_foreground_color: string;
}

export interface CollectiveMembership {
    collective: Collective;
    role: "admin" | "recognized_member" | "member";
}


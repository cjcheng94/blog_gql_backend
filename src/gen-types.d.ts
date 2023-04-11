import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Token: any;
};

export type Draft = {
  __typename?: 'Draft';
  _id: Scalars['ID'];
  author: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  date: Scalars['String'];
  postId?: Maybe<Scalars['ID']>;
  tagIds: Array<Maybe<Scalars['ID']>>;
  tags: Array<Maybe<Tag>>;
  thumbnailUrl?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type Highlight = {
  __typename?: 'Highlight';
  path?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  texts?: Maybe<Array<Maybe<Text>>>;
};

export type Image = {
  __typename?: 'Image';
  _id: Scalars['ID'];
  caption: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token?: Maybe<Scalars['Token']>;
  userId?: Maybe<Scalars['ID']>;
  username?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createDraft?: Maybe<Draft>;
  createImage?: Maybe<Image>;
  createPost: Post;
  createTag?: Maybe<Tag>;
  deleteDraft?: Maybe<Draft>;
  deleteImage?: Maybe<Image>;
  deletePost?: Maybe<Post>;
  deleteTag?: Maybe<Tag>;
  updateDraft?: Maybe<Draft>;
  updateImage?: Maybe<Image>;
  updatePost?: Maybe<Post>;
};


export type MutationCreateDraftArgs = {
  content: Scalars['String'];
  contentText: Scalars['String'];
  postId?: InputMaybe<Scalars['ID']>;
  tagIds: Array<InputMaybe<Scalars['ID']>>;
  thumbnailUrl?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};


export type MutationCreateImageArgs = {
  caption: Scalars['String'];
};


export type MutationCreatePostArgs = {
  content: Scalars['String'];
  contentText: Scalars['String'];
  tagIds: Array<InputMaybe<Scalars['ID']>>;
  thumbnailUrl?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};


export type MutationCreateTagArgs = {
  name: Scalars['String'];
};


export type MutationDeleteDraftArgs = {
  _id: Scalars['String'];
};


export type MutationDeleteImageArgs = {
  _id: Scalars['ID'];
};


export type MutationDeletePostArgs = {
  _id: Scalars['String'];
};


export type MutationDeleteTagArgs = {
  tagId: Scalars['ID'];
};


export type MutationUpdateDraftArgs = {
  _id: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  postId?: InputMaybe<Scalars['ID']>;
  tagIds: Array<InputMaybe<Scalars['ID']>>;
  thumbnailUrl?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};


export type MutationUpdateImageArgs = {
  _id: Scalars['ID'];
  caption: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  _id: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  tagIds: Array<InputMaybe<Scalars['ID']>>;
  thumbnailUrl?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['ID'];
  author: Scalars['String'];
  authorInfo: User;
  content: Scalars['String'];
  contentText: Scalars['String'];
  date: Scalars['String'];
  tagIds: Array<Maybe<Scalars['ID']>>;
  tags: Array<Maybe<Tag>>;
  thumbnailUrl?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type PostResult = {
  __typename?: 'PostResult';
  _id: Scalars['ID'];
  author: Scalars['String'];
  authorInfo: User;
  content: Scalars['String'];
  contentText: Scalars['String'];
  date: Scalars['String'];
  highlights?: Maybe<Array<Maybe<Highlight>>>;
  score?: Maybe<Scalars['Float']>;
  tagIds: Array<Maybe<Scalars['ID']>>;
  tags: Array<Maybe<Tag>>;
  thumbnailUrl?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getDraftById?: Maybe<Draft>;
  getDraftByPostId?: Maybe<Draft>;
  getPostById?: Maybe<Post>;
  getPostsByTags?: Maybe<Array<Maybe<Post>>>;
  getUserDrafts?: Maybe<Array<Maybe<Draft>>>;
  getUserPosts?: Maybe<Array<Maybe<Post>>>;
  image?: Maybe<Image>;
  posts?: Maybe<Array<Maybe<Post>>>;
  search?: Maybe<Array<Maybe<PostResult>>>;
  tag?: Maybe<Tag>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  user?: Maybe<User>;
  userLogin?: Maybe<LoginResponse>;
  userSignup?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryGetDraftByIdArgs = {
  _id: Scalars['String'];
};


export type QueryGetDraftByPostIdArgs = {
  postId: Scalars['ID'];
};


export type QueryGetPostByIdArgs = {
  _id: Scalars['String'];
};


export type QueryGetPostsByTagsArgs = {
  tagIds: Array<InputMaybe<Scalars['ID']>>;
};


export type QueryGetUserPostsArgs = {
  _id: Scalars['String'];
};


export type QueryImageArgs = {
  _id: Scalars['ID'];
};


export type QuerySearchArgs = {
  searchTerm: Scalars['String'];
  tagIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};


export type QueryTagArgs = {
  _id: Scalars['ID'];
};


export type QueryUserArgs = {
  username?: InputMaybe<Scalars['String']>;
};


export type QueryUserLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type QueryUserSignupArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  _id: Scalars['ID'];
  name: Scalars['String'];
};

export type Text = {
  __typename?: 'Text';
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  username: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Draft: ResolverTypeWrapper<Draft>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Highlight: ResolverTypeWrapper<Highlight>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Image: ResolverTypeWrapper<Image>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  PostResult: ResolverTypeWrapper<PostResult>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tag: ResolverTypeWrapper<Tag>;
  Text: ResolverTypeWrapper<Text>;
  Token: ResolverTypeWrapper<Scalars['Token']>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  Draft: Draft;
  Float: Scalars['Float'];
  Highlight: Highlight;
  ID: Scalars['ID'];
  Image: Image;
  LoginResponse: LoginResponse;
  Mutation: {};
  Post: Post;
  PostResult: PostResult;
  Query: {};
  String: Scalars['String'];
  Tag: Tag;
  Text: Text;
  Token: Scalars['Token'];
  User: User;
}>;

export type DraftResolvers<ContextType = any, ParentType extends ResolversParentTypes['Draft'] = ResolversParentTypes['Draft']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contentText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  postId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  tagIds?: Resolver<Array<Maybe<ResolversTypes['ID']>>, ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HighlightResolvers<ContextType = any, ParentType extends ResolversParentTypes['Highlight'] = ResolversParentTypes['Highlight']> = ResolversObject<{
  path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  texts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Text']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  caption?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = ResolversObject<{
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createDraft?: Resolver<Maybe<ResolversTypes['Draft']>, ParentType, ContextType, RequireFields<MutationCreateDraftArgs, 'content' | 'contentText' | 'tagIds' | 'title'>>;
  createImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationCreateImageArgs, 'caption'>>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'content' | 'contentText' | 'tagIds' | 'title'>>;
  createTag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'name'>>;
  deleteDraft?: Resolver<Maybe<ResolversTypes['Draft']>, ParentType, ContextType, RequireFields<MutationDeleteDraftArgs, '_id'>>;
  deleteImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationDeleteImageArgs, '_id'>>;
  deletePost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationDeletePostArgs, '_id'>>;
  deleteTag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'tagId'>>;
  updateDraft?: Resolver<Maybe<ResolversTypes['Draft']>, ParentType, ContextType, RequireFields<MutationUpdateDraftArgs, '_id' | 'content' | 'contentText' | 'tagIds' | 'title'>>;
  updateImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationUpdateImageArgs, '_id' | 'caption'>>;
  updatePost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationUpdatePostArgs, '_id' | 'content' | 'contentText' | 'tagIds' | 'title'>>;
}>;

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  authorInfo?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contentText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tagIds?: Resolver<Array<Maybe<ResolversTypes['ID']>>, ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostResult'] = ResolversParentTypes['PostResult']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  authorInfo?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contentText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  highlights?: Resolver<Maybe<Array<Maybe<ResolversTypes['Highlight']>>>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  tagIds?: Resolver<Array<Maybe<ResolversTypes['ID']>>, ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  thumbnailUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getDraftById?: Resolver<Maybe<ResolversTypes['Draft']>, ParentType, ContextType, RequireFields<QueryGetDraftByIdArgs, '_id'>>;
  getDraftByPostId?: Resolver<Maybe<ResolversTypes['Draft']>, ParentType, ContextType, RequireFields<QueryGetDraftByPostIdArgs, 'postId'>>;
  getPostById?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostByIdArgs, '_id'>>;
  getPostsByTags?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType, RequireFields<QueryGetPostsByTagsArgs, 'tagIds'>>;
  getUserDrafts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Draft']>>>, ParentType, ContextType>;
  getUserPosts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType, RequireFields<QueryGetUserPostsArgs, '_id'>>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<QueryImageArgs, '_id'>>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType>;
  search?: Resolver<Maybe<Array<Maybe<ResolversTypes['PostResult']>>>, ParentType, ContextType, RequireFields<QuerySearchArgs, 'searchTerm'>>;
  tag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagArgs, '_id'>>;
  tags?: Resolver<Maybe<Array<Maybe<ResolversTypes['Tag']>>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUserArgs>>;
  userLogin?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<QueryUserLoginArgs, 'password' | 'username'>>;
  userSignup?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserSignupArgs, 'password' | 'username'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
}>;

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TextResolvers<ContextType = any, ParentType extends ResolversParentTypes['Text'] = ResolversParentTypes['Text']> = ResolversObject<{
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TokenScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Token'], any> {
  name: 'Token';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  Draft?: DraftResolvers<ContextType>;
  Highlight?: HighlightResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostResult?: PostResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  Text?: TextResolvers<ContextType>;
  Token?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
}>;


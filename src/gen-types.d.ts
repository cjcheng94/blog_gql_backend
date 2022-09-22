import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
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
  postId?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  author: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  date: Scalars['String'];
  tags: Array<Maybe<Tag>>;
  tagIds: Array<Maybe<Scalars['ID']>>;
};

export type Highlight = {
  __typename?: 'Highlight';
  path?: Maybe<Scalars['String']>;
  texts?: Maybe<Array<Maybe<Text>>>;
  score?: Maybe<Scalars['Float']>;
};

export type Image = {
  __typename?: 'Image';
  _id: Scalars['ID'];
  caption: Scalars['String'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  userId?: Maybe<Scalars['ID']>;
  username?: Maybe<Scalars['String']>;
  token?: Maybe<Scalars['Token']>;
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
  postId?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  tagIds: Array<Maybe<Scalars['ID']>>;
};


export type MutationCreateImageArgs = {
  caption: Scalars['String'];
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  tagIds: Array<Maybe<Scalars['ID']>>;
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
  postId?: Maybe<Scalars['ID']>;
  title: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  tagIds: Array<Maybe<Scalars['ID']>>;
};


export type MutationUpdateImageArgs = {
  _id: Scalars['ID'];
  caption: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  _id: Scalars['String'];
  title: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  tagIds: Array<Maybe<Scalars['ID']>>;
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['ID'];
  title: Scalars['String'];
  author: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  date: Scalars['String'];
  authorInfo: User;
  tags: Array<Maybe<Tag>>;
  tagIds: Array<Maybe<Scalars['ID']>>;
};

export type PostResult = {
  __typename?: 'PostResult';
  _id: Scalars['ID'];
  title: Scalars['String'];
  author: Scalars['String'];
  content: Scalars['String'];
  contentText: Scalars['String'];
  date: Scalars['String'];
  score?: Maybe<Scalars['Float']>;
  authorInfo: User;
  tags: Array<Maybe<Tag>>;
  tagIds: Array<Maybe<Scalars['ID']>>;
  highlights?: Maybe<Array<Maybe<Highlight>>>;
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
  tagIds: Array<Maybe<Scalars['ID']>>;
};


export type QueryGetUserPostsArgs = {
  _id: Scalars['String'];
};


export type QueryImageArgs = {
  _id: Scalars['ID'];
};


export type QuerySearchArgs = {
  searchTerm: Scalars['String'];
  tagIds?: Maybe<Array<Maybe<Scalars['ID']>>>;
};


export type QueryTagArgs = {
  _id: Scalars['ID'];
};


export type QueryUserArgs = {
  username?: Maybe<Scalars['String']>;
};


export type QueryUserLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type QueryUserSignupArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  _id: Scalars['ID'];
  name: Scalars['String'];
};

export type Text = {
  __typename?: 'Text';
  value?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};


export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  username: Scalars['String'];
};

export type AdditionalEntityFields = {
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
  Draft: ResolverTypeWrapper<Draft>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Highlight: ResolverTypeWrapper<Highlight>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Image: ResolverTypeWrapper<Image>;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  PostResult: ResolverTypeWrapper<PostResult>;
  Query: ResolverTypeWrapper<{}>;
  Tag: ResolverTypeWrapper<Tag>;
  Text: ResolverTypeWrapper<Text>;
  Token: ResolverTypeWrapper<Scalars['Token']>;
  User: ResolverTypeWrapper<User>;
  AdditionalEntityFields: AdditionalEntityFields;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Draft: Draft;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Highlight: Highlight;
  Float: Scalars['Float'];
  Image: Image;
  LoginResponse: LoginResponse;
  Mutation: {};
  Post: Post;
  PostResult: PostResult;
  Query: {};
  Tag: Tag;
  Text: Text;
  Token: Scalars['Token'];
  User: User;
  AdditionalEntityFields: AdditionalEntityFields;
  Boolean: Scalars['Boolean'];
}>;

export type UnionDirectiveArgs = {   discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {   discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {   embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>; };

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = {  };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {   overrideType?: Maybe<Scalars['String']>; };

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = {  };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {   path: Scalars['String']; };

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DraftResolvers<ContextType = any, ParentType extends ResolversParentTypes['Draft'] = ResolversParentTypes['Draft']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  postId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contentText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  tagIds?: Resolver<Array<Maybe<ResolversTypes['ID']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HighlightResolvers<ContextType = any, ParentType extends ResolversParentTypes['Highlight'] = ResolversParentTypes['Highlight']> = ResolversObject<{
  path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  texts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Text']>>>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  caption?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type LoginResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['LoginResponse'] = ResolversParentTypes['LoginResponse']> = ResolversObject<{
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createDraft?: Resolver<Maybe<ResolversTypes['Draft']>, ParentType, ContextType, RequireFields<MutationCreateDraftArgs, 'title' | 'content' | 'contentText' | 'tagIds'>>;
  createImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationCreateImageArgs, 'caption'>>;
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreatePostArgs, 'title' | 'content' | 'contentText' | 'tagIds'>>;
  createTag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'name'>>;
  deleteDraft?: Resolver<Maybe<ResolversTypes['Draft']>, ParentType, ContextType, RequireFields<MutationDeleteDraftArgs, '_id'>>;
  deleteImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationDeleteImageArgs, '_id'>>;
  deletePost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationDeletePostArgs, '_id'>>;
  deleteTag?: Resolver<Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'tagId'>>;
  updateDraft?: Resolver<Maybe<ResolversTypes['Draft']>, ParentType, ContextType, RequireFields<MutationUpdateDraftArgs, '_id' | 'title' | 'content' | 'contentText' | 'tagIds'>>;
  updateImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationUpdateImageArgs, '_id' | 'caption'>>;
  updatePost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<MutationUpdatePostArgs, '_id' | 'title' | 'content' | 'contentText' | 'tagIds'>>;
}>;

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contentText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  authorInfo?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  tagIds?: Resolver<Array<Maybe<ResolversTypes['ID']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PostResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostResult'] = ResolversParentTypes['PostResult']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contentText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  authorInfo?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  tags?: Resolver<Array<Maybe<ResolversTypes['Tag']>>, ParentType, ContextType>;
  tagIds?: Resolver<Array<Maybe<ResolversTypes['ID']>>, ParentType, ContextType>;
  highlights?: Resolver<Maybe<Array<Maybe<ResolversTypes['Highlight']>>>, ParentType, ContextType>;
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
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, never>>;
  userLogin?: Resolver<Maybe<ResolversTypes['LoginResponse']>, ParentType, ContextType, RequireFields<QueryUserLoginArgs, 'username' | 'password'>>;
  userSignup?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserSignupArgs, 'username' | 'password'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
}>;

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = ResolversObject<{
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TextResolvers<ContextType = any, ParentType extends ResolversParentTypes['Text'] = ResolversParentTypes['Text']> = ResolversObject<{
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = ResolversObject<{
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
}>;


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = any> = DirectiveResolvers<ContextType>;
import { ObjectID } from 'mongodb';
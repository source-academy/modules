/* eslint-disable new-cap */
// We have to disable linting rules since Box2D functions do not
// follow the same guidelines as the rest of the codebase.

import {
  type b2Body,
  type b2Shape,
  type b2Fixture,
  b2BodyType,
  b2CircleShape,
  b2PolygonShape,
  b2Vec2,
} from '@box2d/core';
import { type ReplResult } from '../../typings/type_helpers';

import { ACCURACY, type Force, type ForceWithPos } from './types';
import { type PhysicsWorld } from './PhysicsWorld';

export class PhysicsObject implements ReplResult {
  private body: b2Body;
  private shape: b2Shape;
  private fixture: b2Fixture;
  private forcesCentered: Force[] = [];
  private forcesAtAPoint: ForceWithPos[] = [];

  constructor(
    position: b2Vec2,
    rotation: number,
    shape: b2Shape,
    isStatic: boolean,
    world: PhysicsWorld,
  ) {
    this.body = world.createBody({
      type: isStatic ? b2BodyType.b2_staticBody : b2BodyType.b2_dynamicBody,
      position,
      angle: rotation,
    });
    this.shape = shape;

    this.fixture = this.body.CreateFixture({
      shape: this.shape,
      density: 1,
      friction: 1,
    });
  }

  public getFixture() {
    return this.fixture;
  }

  public getMass() {
    return this.body.GetMass();
  }

  public setDensity(density: number) {
    this.fixture.SetDensity(density);
    this.body.ResetMassData();
  }

  public setFriction(friction: number) {
    this.fixture.SetFriction(friction);
  }

  public getPosition() {
    return this.body.GetPosition();
  }

  public setPosition(pos: b2Vec2) {
    this.body.SetTransformVec(pos, this.getRotation());
  }

  public getRotation() {
    return this.body.GetAngle();
  }

  public setRotation(rot: number) {
    this.body.SetAngle(rot);
  }

  public getVelocity() {
    return this.body.GetLinearVelocity();
  }

  public setVelocity(velc: b2Vec2) {
    this.body.SetLinearVelocity(velc);
  }

  public getAngularVelocity() {
    return this.body.GetAngularVelocity();
  }

  public setAngularVelocity(velc: number) {
    this.body.SetAngularVelocity(velc);
  }

  public addForceCentered(force: Force) {
    this.forcesCentered.push(force);
  }

  public addForceAtAPoint(force: Force, pos: b2Vec2) {
    this.forcesAtAPoint.push({
      force,
      pos,
    });
  }

  private applyForcesToCenter(world_time: number) {
    this.forcesCentered = this.forcesCentered.filter(
      (force: Force) => force.start_time + force.duration > world_time,
    );

    const resForce = this.forcesCentered
      .filter((force: Force) => force.start_time < world_time)
      .reduce(
        (res: b2Vec2, force: Force) => res.Add(force.direction.Scale(force.magnitude)),
        new b2Vec2(),
      );

    this.body.ApplyForceToCenter(resForce);
  }

  private applyForcesAtAPoint(world_time: number) {
    this.forcesAtAPoint = this.forcesAtAPoint.filter(
      (forceWithPos: ForceWithPos) => forceWithPos.force.start_time + forceWithPos.force.duration > world_time,
    );

    this.forcesAtAPoint.forEach((forceWithPos) => {
      const force = forceWithPos.force;
      this.body.ApplyForce(
        force.direction.Scale(force.magnitude),
        forceWithPos.pos,
      );
    });
  }

  public applyForces(world_time: number) {
    this.applyForcesToCenter(world_time);
    this.applyForcesAtAPoint(world_time);
  }

  public isTouching(obj2: PhysicsObject) {
    let ce = this.body.GetContactList();
    while (ce !== null) {
      if (ce.other === obj2.body && ce.contact.IsTouching()) {
        return true;
      }
      ce = ce.next;
    }
    return false;
  }

  public toReplString = () => `
  Mass: ${this.getMass()
    .toFixed(ACCURACY)}
  Position: [${this.getPosition().x.toFixed(
    ACCURACY,
  )},${this.getPosition().y.toFixed(ACCURACY)}]
  Velocity: [${this.getVelocity().x.toFixed(
    ACCURACY,
  )},${this.getVelocity().y.toFixed(ACCURACY)}] 
  
  Rotation: ${this.getRotation()
    .toFixed(ACCURACY)}
  AngularVelocity: [${this.getAngularVelocity()
    .toFixed(ACCURACY)}]`;

  public scale_size(scale: number) {
    if (this.shape instanceof b2CircleShape) {
      this.shape.m_radius *= scale;
    } else if (this.shape instanceof b2PolygonShape) {
      const centroid: b2Vec2 = this.shape.m_centroid;
      const arr: b2Vec2[] = [];
      this.shape.m_vertices.forEach((vec) => {
        arr.push(
          new b2Vec2(
            centroid.x + scale * (vec.x - centroid.x),
            centroid.y + scale * (vec.y - centroid.y),
          ),
        );
      });
      this.shape = new b2PolygonShape()
        .Set(arr);
    }
    const f: b2Fixture = this.fixture;
    this.body.DestroyFixture(this.fixture);
    this.fixture = this.body.CreateFixture({
      shape: this.shape,
      density: f.GetDensity(),
      friction: f.GetFriction(),
    });
  }
}

/* eslint-disable new-cap */
// We have to disable linting rules since Box2D functions do not
// follow the same guidelines as the rest of the codebase.

import {
  type b2Body,
  type b2Fixture,
  type b2BodyDef,
  b2BodyType,
  b2PolygonShape,
  type b2StepConfig,
  b2Vec2,
  b2World,
  b2ContactListener,
  type b2Contact,
} from '@box2d/core';
import { type PhysicsObject } from './PhysicsObject';
import { Timer } from './types';

export class PhysicsWorld {
  private b2World: b2World;
  private physicsObjects: PhysicsObject[];
  private timer: Timer;
  private touchingObjects: Map<b2Fixture, Map<b2Fixture, number>>;

  private iterationsConfig: b2StepConfig = {
    velocityIterations: 8,
    positionIterations: 3,
  };

  constructor() {
    this.b2World = b2World.Create(new b2Vec2());
    this.physicsObjects = [];
    this.timer = new Timer();
    this.touchingObjects = new Map<b2Fixture, Map<b2Fixture, number>>();

    const contactListener: b2ContactListener = new b2ContactListener();
    contactListener.BeginContact = (contact: b2Contact) => {
      const m = this.touchingObjects.get(contact.GetFixtureA());
      if (m === undefined) {
        const newMap = new Map<b2Fixture, number>();
        newMap.set(contact.GetFixtureB(), this.timer.getTime());
        this.touchingObjects.set(contact.GetFixtureA(), newMap);
      } else {
        m.set(contact.GetFixtureB(), this.timer.getTime());
      }
    };
    contactListener.EndContact = (contact: b2Contact) => {
      const contacts = this.touchingObjects.get(contact.GetFixtureA());
      if (contacts) {
        contacts.delete(contact.GetFixtureB());
      }
    };

    this.b2World.SetContactListener(contactListener);
  }

  public setGravity(gravity: b2Vec2) {
    this.b2World.SetGravity(gravity);
  }

  public addObject(obj: PhysicsObject) {
    this.physicsObjects.push(obj);
    return obj;
  }

  public createBody(bodyDef: b2BodyDef) {
    return this.b2World.CreateBody(bodyDef);
  }

  public makeGround(height: number, friction: number) {
    const groundBody: b2Body = this.createBody({
      type: b2BodyType.b2_staticBody,
      position: new b2Vec2(0, height - 10),
    });
    const groundShape: b2PolygonShape = new b2PolygonShape()
      .SetAsBox(
        10000,
        10,
      );

    groundBody.CreateFixture({
      shape: groundShape,
      density: 1,
      friction,
    });
  }

  public update(dt: number) {
    for (const obj of this.physicsObjects) {
      obj.applyForces(this.timer.getTime());
    }
    this.b2World.Step(dt, this.iterationsConfig);
    this.timer.step(dt);
  }

  public simulate(total_time: number) {
    const dt = 0.01;
    for (let i = 0; i < total_time; i += dt) {
      this.update(dt);
    }
  }

  public getB2World() {
    return this.b2World;
  }

  public getWorldStatus(): String {
    let world_status: String = `
  World time: ${this.timer.toString()}
  
  Objects:
      `;
    this.physicsObjects.forEach((obj) => {
      world_status += `
  ------------------------
  ${obj.toReplString()}
  ------------------------
        `;
    });
    return world_status;
  }

  public findImpact(obj1: PhysicsObject, obj2: PhysicsObject) {
    const m = this.touchingObjects.get(obj1.getFixture());
    if (m === undefined) {
      return -1;
    }
    const time = m.get(obj2.getFixture());
    if (time === undefined) {
      return -1;
    }
    return time;
  }
}
